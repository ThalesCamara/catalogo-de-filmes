
window.onload = carregarFavoritos;

async function carregarFavoritos(){

const usuario = getUsuario();

const response = await fetch(API+"/favoritos/"+usuario.id);

const filmes = await response.json();

const grid = document.getElementById("favoritos");

grid.innerHTML="";

filmes.forEach(f=>{

grid.innerHTML += `
<div class="filme-card">

<div class="filme-titulo">${f.titulo}</div>

<p>${f.genero}</p>

<button onclick="remover(${f.id})">
Remover
</button>

</div>
`;

});

}

async function remover(filmeId){

const usuario = getUsuario();

await fetch(API+"/favoritos/"+usuario.id+"/"+filmeId,{
method:"DELETE"
});

carregarFavoritos();

}

function voltar(){
window.location="catalogo.html";
}

