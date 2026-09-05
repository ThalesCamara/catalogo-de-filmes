window.addEventListener("load", () => {
  configurarMenuUsuario();
  carregarFavoritos();
});

async function carregarFavoritos() {
  const usuario = getUsuario();
  if (!usuario) {
    window.location = "login.html";
    return;
  }

  const grid = document.getElementById("favoritos");
  const mensagem = document.getElementById("mensagem");
  mensagem.textContent = "Carregando favoritos...";

  try {
    const response = await fetch(`${API}/favoritos/${usuario.id}`);
    if (!response.ok) throw new Error();

    const filmes = await response.json();
    grid.innerHTML = "";

    filmes.forEach((filme, indice) => {
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
      atualizarBotaoFavorito(botao, true);
      botao.addEventListener("click", () => remover(filme, card, botao));

      card.append(link, botao);
      grid.appendChild(card);
    });

    mensagem.textContent = filmes.length ? "" : "Você ainda não adicionou favoritos.";
  } catch {
    mensagem.textContent = "Não foi possível carregar seus favoritos.";
  }
}

async function remover(filme, card, botao) {
  botao.disabled = true;

  try {
    await alterarFavorito(filme.id, true);
    card.classList.add("is-removing");
    window.setTimeout(() => {
      card.remove();
      const grid = document.getElementById("favoritos");
      document.getElementById("mensagem").textContent = grid.children.length
        ? `${filme.titulo} foi removido dos favoritos.`
        : "Você ainda não adicionou favoritos.";
    }, 220);
  } catch (error) {
    botao.disabled = false;
    document.getElementById("mensagem").textContent = error.message;
  }
}
