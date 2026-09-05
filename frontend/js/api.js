
const API = "http://localhost:8080";

function salvarUsuario(usuario){
localStorage.setItem("usuario", JSON.stringify(usuario));
}

function getUsuario(){
try {
return JSON.parse(localStorage.getItem("usuario"));
} catch {
localStorage.removeItem("usuario");
return null;
}
}

function logout(){
localStorage.removeItem("usuario");
window.location="index.html";
}

function configurarMenuUsuario() {
const usuario = getUsuario();
const botaoEntrar = document.getElementById("botao-entrar");
const botaoGerenciar = document.getElementById("botao-gerenciar");
const menuPerfil = document.getElementById("menu-perfil");

if (botaoEntrar) botaoEntrar.hidden = Boolean(usuario);
if (botaoGerenciar) botaoGerenciar.hidden = !usuario;
if (!menuPerfil) return;

menuPerfil.hidden = !usuario;
if (!usuario) return;

const botaoPerfil = document.getElementById("botao-perfil");
const opcoesPerfil = document.getElementById("opcoes-perfil");
document.getElementById("nome-usuario").textContent = usuario.nome;

function fecharMenuPerfil() {
opcoesPerfil.hidden = true;
botaoPerfil.setAttribute("aria-expanded", "false");
}

botaoPerfil.addEventListener("click", event => {
event.stopPropagation();
const deveAbrir = opcoesPerfil.hidden;
opcoesPerfil.hidden = !deveAbrir;
botaoPerfil.setAttribute("aria-expanded", String(deveAbrir));
});

opcoesPerfil.addEventListener("click", event => event.stopPropagation());
document.addEventListener("click", fecharMenuPerfil);
document.addEventListener("keydown", event => {
if (event.key === "Escape") {
fecharMenuPerfil();
botaoPerfil.focus();
}
});
}

function criarElementoCapa(filme) {
const moldura = document.createElement("div");
moldura.className = "capa-container";

if (!filme.capaUrl) {
moldura.classList.add("sem-capa");
moldura.textContent = "Capa indisponível";
return moldura;
}

const imagem = document.createElement("img");
imagem.className = "filme-capa";
imagem.src = filme.capaUrl;
imagem.alt = `Capa do filme ${filme.titulo}`;
imagem.loading = "lazy";
imagem.addEventListener("error", () => {
imagem.remove();
moldura.classList.add("sem-capa");
moldura.textContent = "Capa indisponível";
});
moldura.appendChild(imagem);
return moldura;
}

async function buscarIdsFavoritos(usuario = getUsuario()) {
if (!usuario) return new Set();

const response = await fetch(`${API}/favoritos/${usuario.id}`);
if (!response.ok) throw new Error("Não foi possível consultar seus favoritos.");

const favoritos = await response.json();
return new Set(favoritos.map(filme => filme.id));
}

async function alterarFavorito(filmeId, favoritoAtual) {
const usuario = getUsuario();

if (!usuario) {
window.location = "login.html";
return null;
}

const response = await fetch(
favoritoAtual
? `${API}/favoritos/${usuario.id}/${filmeId}`
: `${API}/favoritos`,
favoritoAtual
? { method: "DELETE" }
: {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ usuarioId: usuario.id, filmeId })
}
);

if (!response.ok) throw new Error("Não foi possível atualizar seus favoritos.");
return !favoritoAtual;
}

function atualizarBotaoFavorito(botao, favorito) {
botao.classList.toggle("is-favorite", favorito);
botao.setAttribute("aria-pressed", String(favorito));
botao.textContent = favorito ? "♥ Desfavoritar" : "♡ Favoritar";
}

