function agregarTarea() {
  let tarea = document.getElementById("tarea").value.trim();
  let lista = document.getElementById("lista");

  if (tarea === "") return;

  let li = document.createElement("li");
  li.innerHTML = `${tarea} <button onclick="eliminar(this)">❌</button>`;
  li.onclick = function() { li.style.textDecoration = "line-through"; };

  lista.appendChild(li);
  document.getElementById("tarea").value = "";
}

function eliminar(boton) {
  boton.parentElement.remove();
}
