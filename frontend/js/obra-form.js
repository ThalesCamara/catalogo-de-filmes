const modoFormulario = document.body.dataset.formMode;
let idObraAtual = null;

window.addEventListener("load", () => {
  if (!getUsuario()) {
    window.location = "login.html";
    return;
  }

  configurarMenuUsuario();
  configurarFormularioObra();

  if (modoFormulario === "editar") carregarObraParaEdicao();
  else definirDataAtual();
});

function configurarFormularioObra() {
  document.getElementById("form-obra").addEventListener("submit", salvarObra);
  document.getElementById("obra-capa").addEventListener("input", atualizarPreviaCapa);
}

async function carregarObraParaEdicao() {
  const mensagem = document.getElementById("mensagem-form");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id || !/^\d+$/.test(id)) {
    mensagem.textContent = "Obra inválida. Volte para o catálogo e escolha uma obra.";
    document.getElementById("salvar-obra").disabled = true;
    return;
  }

  idObraAtual = id;

  try {
    const response = await fetch(`${API}/filmes/${encodeURIComponent(id)}`);
    if (!response.ok) throw new Error();

    const obra = await response.json();
    document.getElementById("obra-id").value = obra.id;
    document.getElementById("obra-titulo").value = obra.titulo || "";
    document.getElementById("obra-genero").value = obra.genero || "";
    document.getElementById("obra-data").value = obra.dataLancamento || "";
    document.getElementById("obra-capa").value = obra.capaUrl || "";
    document.getElementById("obra-descricao").value = obra.descricao || "";
    document.getElementById("obra-criado-em").value = paraDataLocal(obra.createdAt);
    document.title = `Editar ${obra.titulo} | CineMatch`;
    mensagem.textContent = "";
    atualizarPreviaCapa();
  } catch {
    mensagem.textContent = "Não foi possível carregar esta obra.";
    document.getElementById("salvar-obra").disabled = true;
  }
}

async function salvarObra(event) {
  event.preventDefault();

  const botao = document.getElementById("salvar-obra");
  const mensagem = document.getElementById("mensagem-form");
  const obra = {
    titulo: document.getElementById("obra-titulo").value.trim(),
    descricao: valorOuNulo("obra-descricao"),
    genero: valorOuNulo("obra-genero"),
    dataLancamento: valorOuNulo("obra-data"),
    capaUrl: valorOuNulo("obra-capa"),
    createdAt: valorDataHoraOuNulo("obra-criado-em")
  };

  botao.disabled = true;
  mensagem.textContent = modoFormulario === "editar" ? "Salvando alterações..." : "Adicionando obra...";

  try {
    const url = modoFormulario === "editar"
      ? `${API}/filmes/${encodeURIComponent(idObraAtual)}`
      : `${API}/filmes`;
    const response = await fetch(url, {
      method: modoFormulario === "editar" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obra)
    });

    if (!response.ok) throw new Error();
    mensagem.classList.add("is-success");
    mensagem.textContent = modoFormulario === "editar"
      ? "Alterações salvas. Voltando para o catálogo..."
      : "Obra adicionada. Voltando para o catálogo...";
    window.setTimeout(() => { window.location = "gerenciar-catalogo.html"; }, 850);
  } catch {
    mensagem.classList.remove("is-success");
    mensagem.textContent = "Não foi possível salvar a obra. Verifique os dados e tente novamente.";
    botao.disabled = false;
  }
}

function atualizarPreviaCapa() {
  const url = document.getElementById("obra-capa").value.trim();
  const previa = document.getElementById("previa-capa");
  previa.innerHTML = "";

  if (!url) {
    previa.classList.add("sem-capa");
    previa.textContent = "A capa aparecerá aqui";
    return;
  }

  const imagem = document.createElement("img");
  imagem.src = url;
  imagem.alt = "Prévia da capa da obra";
  imagem.addEventListener("error", () => {
    imagem.remove();
    previa.classList.add("sem-capa");
    previa.textContent = "Não foi possível carregar esta imagem";
  });
  previa.classList.remove("sem-capa");
  previa.appendChild(imagem);
}

function definirDataAtual() {
  const agora = new Date();
  const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000);
  document.getElementById("obra-criado-em").value = local.toISOString().slice(0, 19);
}

function paraDataLocal(valor) {
  return valor ? valor.slice(0, 19) : "";
}

function valorOuNulo(id) {
  const valor = document.getElementById(id).value.trim();
  return valor || null;
}

function valorDataHoraOuNulo(id) {
  const valor = document.getElementById(id).value;
  if (!valor) return null;
  return valor.length === 16 ? `${valor}:00` : valor;
}
