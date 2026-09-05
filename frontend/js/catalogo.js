let favoritosIds = new Set();

window.addEventListener("load", () => {
  atualizarMenu();
  carregarFilmes();
});

function atualizarMenu() {
  configurarMenuUsuario();
}

async function carregarFilmes() {
  const grid = document.getElementById("filmes");
  const mensagem = document.getElementById("mensagem");
  mensagem.textContent = "Preparando sua sessão...";

  try {
    const filmesPromise = fetch(API + "/filmes").then(response => {
      if (!response.ok) throw new Error();
      return response.json();
    });

    const favoritosPromise = getUsuario()
      ? buscarIdsFavoritos().catch(() => new Set())
      : Promise.resolve(new Set());

    const [filmes, idsFavoritos] = await Promise.all([filmesPromise, favoritosPromise]);
    favoritosIds = idsFavoritos;
    grid.innerHTML = "";

    filmes.forEach((filme, indice) => {
      grid.appendChild(criarCardFilme(filme, indice));
    });

    mensagem.textContent = filmes.length ? "" : "Nenhum filme cadastrado ainda.";
  } catch {
    mensagem.textContent = "Não foi possível carregar os filmes. Verifique se o backend está ligado.";
  }
}

function criarCardFilme(filme, indice) {
  const card = document.createElement("article");
  card.className = "filme-card";
  card.style.setProperty("--card-delay", `${Math.min(indice * 55, 330)}ms`);

  const link = document.createElement("a");
  link.className = "filme-link";
  link.href = `filme?id=${encodeURIComponent(filme.id)}`;
  link.setAttribute("aria-label", `Ver detalhes de ${filme.titulo}`);

  const conteudo = document.createElement("div");
  conteudo.className = "filme-card-content";

  const titulo = document.createElement("h2");
  titulo.className = "filme-titulo";
  titulo.textContent = filme.titulo;

  const genero = document.createElement("p");
  genero.className = "filme-genero";
  genero.textContent = filme.genero || "Gênero não informado";

  conteudo.append(titulo, genero);
  link.append(criarElementoCapa(filme), conteudo);

  const botao = document.createElement("button");
  botao.className = "favorite-button";
  atualizarBotaoFavorito(botao, favoritosIds.has(filme.id));
  botao.addEventListener("click", () => alternarFavoritoCatalogo(filme, botao));

  card.append(link, botao);
  return card;
}

async function alternarFavoritoCatalogo(filme, botao) {
  if (!getUsuario()) {
    window.location = "login.html";
    return;
  }

  const favoritoAtual = favoritosIds.has(filme.id);
  botao.disabled = true;

  try {
    const novoEstado = await alterarFavorito(filme.id, favoritoAtual);
    if (novoEstado) favoritosIds.add(filme.id);
    else favoritosIds.delete(filme.id);

    atualizarBotaoFavorito(botao, novoEstado);
    mostrarFeedback(novoEstado
      ? `${filme.titulo} foi adicionado aos favoritos.`
      : `${filme.titulo} foi removido dos favoritos.`);
  } catch (error) {
    mostrarFeedback(error.message);
  } finally {
    botao.disabled = false;
  }
}

function mostrarFeedback(texto) {
  const mensagem = document.getElementById("mensagem");
  mensagem.textContent = texto;
  mensagem.classList.add("is-visible");
  window.clearTimeout(mostrarFeedback.timeout);
  mostrarFeedback.timeout = window.setTimeout(() => mensagem.classList.remove("is-visible"), 2800);
}

function irFavoritos() { window.location = getUsuario() ? "favoritos.html" : "login.html"; }
function irLogin() { window.location = "login.html"; }
