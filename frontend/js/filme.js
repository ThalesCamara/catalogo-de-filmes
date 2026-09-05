let filmeAtual = null;
let filmeFavorito = false;

window.addEventListener("load", () => {
  atualizarMenuDetalhe();
  carregarDetalhes();
});

function atualizarMenuDetalhe() {
  configurarMenuUsuario();
}

async function carregarDetalhes() {
  const mensagem = document.getElementById("mensagem");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id || !/^\d+$/.test(id)) {
    mensagem.textContent = "Filme inválido. Volte ao catálogo e escolha um título.";
    return;
  }

  try {
    const response = await fetch(`${API}/filmes/${encodeURIComponent(id)}`);
    if (!response.ok) throw new Error();

    filmeAtual = await response.json();
    document.title = `${filmeAtual.titulo} | CineMatch`;
    document.getElementById("detalhe-titulo").textContent = filmeAtual.titulo;
    document.getElementById("detalhe-genero").textContent = filmeAtual.genero || "Gênero não informado";
    document.getElementById("detalhe-data").textContent = formatarData(filmeAtual.dataLancamento);
    document.getElementById("detalhe-descricao").textContent = filmeAtual.descricao || "Descrição não disponível.";
    montarCapa(filmeAtual);

    const botaoFavorito = document.getElementById("detalhe-favoritar");
    if (getUsuario()) {
      const favoritos = await buscarIdsFavoritos().catch(() => new Set());
      filmeFavorito = favoritos.has(filmeAtual.id);
    }
    atualizarBotaoFavorito(botaoFavorito, filmeFavorito);
    botaoFavorito.addEventListener("click", alternarFavoritoFilmeAtual);
    document.getElementById("detalhe-filme").hidden = false;
    mensagem.textContent = "";
  } catch {
    mensagem.textContent = "Não foi possível carregar este filme.";
  }
}

function formatarData(data) {
  if (!data) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${data}T00:00:00`));
}

function montarCapa(filme) {
  const container = document.getElementById("detalhe-capa");
  if (!filme.capaUrl) {
    container.classList.add("sem-capa");
    container.textContent = "Capa indisponível";
    return;
  }

  const imagem = document.createElement("img");
  imagem.src = filme.capaUrl;
  imagem.alt = `Capa do filme ${filme.titulo}`;
  imagem.addEventListener("error", () => {
    imagem.remove();
    container.classList.add("sem-capa");
    container.textContent = "Capa indisponível";
  });
  container.appendChild(imagem);
}

async function alternarFavoritoFilmeAtual() {
  const usuario = getUsuario();
  if (!usuario) {
    window.location = "login.html";
    return;
  }

  const botao = document.getElementById("detalhe-favoritar");
  botao.disabled = true;

  try {
    filmeFavorito = await alterarFavorito(filmeAtual.id, filmeFavorito);
    atualizarBotaoFavorito(botao, filmeFavorito);
    const mensagem = document.getElementById("mensagem");
    mensagem.textContent = filmeFavorito
      ? "Filme adicionado aos favoritos."
      : "Filme removido dos favoritos.";
    mensagem.classList.add("is-visible");
  } catch (error) {
    document.getElementById("mensagem").textContent = error.message;
  } finally {
    botao.disabled = false;
  }
}

function irFavoritos() { window.location = getUsuario() ? "favoritos.html" : "login.html"; }
function irLogin() { window.location = "login.html"; }
