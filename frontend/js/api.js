
const API = "http://localhost:8080";

function salvarUsuario(usuario){
localStorage.setItem("usuario", JSON.stringify(usuario));
}

function getUsuario(){
return JSON.parse(localStorage.getItem("usuario"));
}

function logout(){
localStorage.removeItem("usuario");
window.location="index.html";
}

