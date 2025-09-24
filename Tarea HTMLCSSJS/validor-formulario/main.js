function validar() {
  let nombre = document.getElementById("nombre").value.trim();
  let correo = document.getElementById("correo").value.trim();
  let mensaje = document.getElementById("mensaje");

  if (nombre === "" || correo === "") {
    mensaje.textContent = "⚠️ Todos los campos son obligatorios";
    mensaje.style.color = "red";
  } else {
    mensaje.textContent = "✅ Registro exitoso";
    mensaje.style.color = "green";
  }
}
