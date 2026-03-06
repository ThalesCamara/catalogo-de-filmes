
window.onload = carregarFilmes;

async function carregarFilmes(){

const response = await fetch(API+"/filmes");

const filmes = await response.json();

const grid = document.getElementById("filmes");

grid.innerHTML="";

filmes.forEach(f=>{

grid.innerHTML += `
<div class="filme-card">

<div class="filme-titulo">${f.titulo}</div>

<p>${f.genero}</p>

<button onclick="favoritar(${f.id})">
Adicionar aos favoritos
</button>

</div>
`;

});

}

async function favoritar(filmeId){

const usuario = getUsuario();

await fetch(API+"/favoritos",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
usuarioId:usuario.id,
filmeId:filmeId
})

});

alert("Adicionado aos favoritos");

}

function irFavoritos(){
window.location="favoritos.html";
}

