async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const response = await fetch(API + "/usuarios/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      senhaHash: senha
    })
  });

  if (response.status === 200) {
    const usuario = await response.json();
    salvarUsuario(usuario);
    window.location = "catalogo.html";
  } else {
    document.getElementById("erro").innerText = "Login inválido";
  }
}