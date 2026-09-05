const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");
const tabLogin = document.getElementById("tab-login");
const tabCadastro = document.getElementById("tab-cadastro");
const feedback = document.getElementById("erro");

function alternarFormulario(cadastroAtivo) {
  formLogin.hidden = cadastroAtivo;
  formCadastro.hidden = !cadastroAtivo;
  tabLogin.classList.toggle("active", !cadastroAtivo);
  tabCadastro.classList.toggle("active", cadastroAtivo);
  feedback.textContent = "";
  (cadastroAtivo ? document.getElementById("cadastro-nome") : document.getElementById("email")).focus();
}

function mostrarLogin() { alternarFormulario(false); }
function mostrarCadastro() { alternarFormulario(true); }

async function login(event) {
  event.preventDefault();
  feedback.textContent = "Entrando...";
  try {
    const response = await fetch(API + "/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("email").value.trim(),
        senhaHash: document.getElementById("senha").value
      })
    });
    if (!response.ok) throw new Error("E-mail ou senha incorretos.");
    salvarUsuario(await response.json());
    window.location = "index.html";
  } catch (error) {
    feedback.textContent = error.message === "Failed to fetch"
      ? "Não foi possível conectar ao servidor. Verifique se o backend está ligado."
      : error.message;
  }
}

async function cadastrar(event) {
  event.preventDefault();
  feedback.textContent = "Criando sua conta...";
  try {
    const response = await fetch(API + "/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: document.getElementById("cadastro-nome").value.trim(),
        email: document.getElementById("cadastro-email").value.trim(),
        senhaHash: document.getElementById("cadastro-senha").value
      })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.mensagem || "Não foi possível criar a conta.");
    salvarUsuario(body);
    window.location = "index.html";
  } catch (error) {
    feedback.textContent = error.message === "Failed to fetch"
      ? "Não foi possível conectar ao servidor. Verifique se o backend está ligado."
      : error.message;
  }
}
