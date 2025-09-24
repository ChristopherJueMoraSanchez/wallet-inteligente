let imagenes = ["img1.png", "img2.png", "img3.jpg"];
let indice = 0;

function mostrarImagen() {
  document.getElementById("imagen").src = imagenes[indice];
}

function siguiente() {
  indice = (indice + 1) % imagenes.length;
  mostrarImagen();
}

function anterior() {
  indice = (indice - 1 + imagenes.length) % imagenes.length;
  mostrarImagen();
}
