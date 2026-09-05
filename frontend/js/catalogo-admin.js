let obrasCatalogo = [];
let obraSelecionadaParaExcluir = null;

window.addEventListener("load", () => {
  if (!getUsuario()) {
    window.location = "login.html";
    return;
  }

  configurarMenuUsuario();
  configurarControlesCatalogo();
  carregarCatalogoAdministrativo();
});

function configurarControlesCatalogo() {
  document.getElementById("busca-obras").addEventListener("input", renderizarObras);
  document.getElementById("filtro-genero").addEventListener("change", renderizarObras);
  document.getElementById("ordenacao-obras").addEventListener("change", renderizarObras);
  document.getElementById("cancelar-exclusao").addEventListener("click", fecharDialogoExclusao);
  document.getElementById("confirmar-exclusao").addEventListener("click", excluirObraSelecionada);

  document.getElementById("dialogo-excluir").addEventListener("click", event => {
    if (event.target === event.currentTarget) fecharDialogoExclusao();
  });
}

async function carregarCatalogoAdministrativo() {
  const mensagem = document.getElementById("mensagem-admin");
  mensagem.textContent = "Carregando catálogo...";

  try {
    const response = await fetch(`${API}/filmes`);
    if (!response.ok) throw new Error();

    obrasCatalogo = await response.json();
    preencherFiltroGeneros();
    renderizarObras();
    mensagem.textContent = "";
  } catch {
    mensagem.textContent = "Não foi possível carregar o catálogo. Verifique se o backend está ligado.";
    document.getElementById("contador-obras").textContent = "Catálogo indisponível";
  }
}

function preencherFiltroGeneros() {
  const select = document.getElementById("filtro-genero");
  const generoAtual = select.value;
  const generos = [...new Set(obrasCatalogo.map(obra => obra.genero).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  select.innerHTML = '<option value="">Todos os gêneros</option>';

  generos.forEach(genero => {
    const option = document.createElement("option");
    option.value = genero;
    option.textContent = genero;
    select.appendChild(option);
  });

  if (generos.includes(generoAtual)) select.value = generoAtual;
}

function renderizarObras() {
  const lista = document.getElementById("lista-obras");
  const busca = normalizarTexto(document.getElementById("busca-obras").value);
  const genero = document.getElementById("filtro-genero").value;
  const ordenacao = document.getElementById("ordenacao-obras").value;

  const obrasVisiveis = obrasCatalogo
    .filter(obra => {
      const textoObra = normalizarTexto(`${obra.titulo} ${obra.genero || ""} ${obra.descricao || ""}`);
      return (!busca || textoObra.includes(busca)) && (!genero || obra.genero === genero);
    })
    .sort(criarComparador(ordenacao));

  lista.innerHTML = "";
  obrasVisiveis.forEach(obra => lista.appendChild(criarLinhaObra(obra)));

  const total = obrasCatalogo.length;
  const exibidas = obrasVisiveis.length;
  document.getElementById("contador-obras").textContent = exibidas === total
    ? `${total} ${total === 1 ? "obra cadastrada" : "obras cadastradas"}`
    : `${exibidas} de ${total} obras`;

  if (!exibidas) {
    const vazio = document.createElement("div");
    vazio.className = "empty-state";
    vazio.innerHTML = "<strong>Nenhuma obra encontrada</strong><span>Tente mudar a busca ou os filtros.</span>";
    lista.appendChild(vazio);
  }
}

function criarLinhaObra(obra) {
  const artigo = document.createElement("article");
  artigo.className = "work-row";
  artigo.dataset.obraId = obra.id;

  const capa = document.createElement("div");
  capa.className = "work-thumbnail";
  if (obra.capaUrl) {
    const imagem = document.createElement("img");
    imagem.src = obra.capaUrl;
    imagem.alt = "";
    imagem.addEventListener("error", () => {
      imagem.remove();
      capa.textContent = "Sem capa";
    });
    capa.appendChild(imagem);
  } else {
    capa.textContent = "Sem capa";
  }

  const informacoes = document.createElement("div");
  informacoes.className = "work-info";

  const titulo = document.createElement("h2");
  titulo.textContent = obra.titulo;

  const meta = document.createElement("p");
  meta.className = "work-meta";
  meta.textContent = [obra.genero || "Sem gênero", formatarDataCurta(obra.dataLancamento), `ID ${obra.id}`].join(" · ");

  const descricao = document.createElement("p");
  descricao.className = "work-description";
  descricao.textContent = obra.descricao || "Sem descrição.";

  informacoes.append(titulo, meta, descricao);

  const acoes = document.createElement("div");
  acoes.className = "work-actions";

  const editar = document.createElement("a");
  editar.className = "action-link action-link-secondary";
  editar.href = `editar-obra?id=${encodeURIComponent(obra.id)}`;
  editar.textContent = "Editar";

  const excluir = document.createElement("button");
  excluir.className = "danger-button danger-button-subtle";
  excluir.type = "button";
  excluir.textContent = "Excluir";
  excluir.addEventListener("click", () => abrirDialogoExclusao(obra));

  acoes.append(editar, excluir);
  artigo.append(capa, informacoes, acoes);
  return artigo;
}

function criarComparador(ordenacao) {
  if (ordenacao === "titulo-desc") {
    return (a, b) => b.titulo.localeCompare(a.titulo, "pt-BR");
  }
  if (ordenacao === "lancamento-desc") {
    return (a, b) => (b.dataLancamento || "").localeCompare(a.dataLancamento || "");
  }
  if (ordenacao === "cadastro-desc") {
    return (a, b) => (b.createdAt || "").localeCompare(a.createdAt || "") || b.id - a.id;
  }
  return (a, b) => a.titulo.localeCompare(b.titulo, "pt-BR");
}

function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}

function formatarDataCurta(data) {
  if (!data) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", { year: "numeric", month: "short" })
    .format(new Date(`${data}T00:00:00`));
}

function abrirDialogoExclusao(obra) {
  obraSelecionadaParaExcluir = obra;
  document.getElementById("nome-obra-excluir").textContent = obra.titulo;
  document.getElementById("dialogo-excluir").showModal();
}

function fecharDialogoExclusao() {
  obraSelecionadaParaExcluir = null;
  document.getElementById("dialogo-excluir").close();
}

async function excluirObraSelecionada() {
  if (!obraSelecionadaParaExcluir) return;

  const obra = obraSelecionadaParaExcluir;
  const botao = document.getElementById("confirmar-exclusao");
  botao.disabled = true;

  try {
    const response = await fetch(`${API}/filmes/${encodeURIComponent(obra.id)}`, { method: "DELETE" });
    if (!response.ok) throw new Error();

    obrasCatalogo = obrasCatalogo.filter(item => item.id !== obra.id);
    fecharDialogoExclusao();
    preencherFiltroGeneros();
    renderizarObras();
    document.getElementById("mensagem-admin").textContent = `${obra.titulo} foi excluída do catálogo.`;
  } catch {
    document.getElementById("mensagem-admin").textContent = "Não foi possível excluir a obra.";
  } finally {
    botao.disabled = false;
  }
}
