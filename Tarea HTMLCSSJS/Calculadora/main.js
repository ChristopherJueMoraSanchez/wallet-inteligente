// Función para validar entradas
function obtenerValores() {
  let num1 = document.getElementById("num1").value;
  let num2 = document.getElementById("num2").value;
  let mensaje = document.getElementById("mensaje");

  if (num1.trim() === "" || num2.trim() === "") {
    mensaje.textContent = "⚠️ Ambos campos deben tener un valor.";
    return null;
  }

  num1 = parseFloat(num1);
  num2 = parseFloat(num2);

  if (isNaN(num1) || isNaN(num2)) {
    mensaje.textContent = "⚠️ Ingresa solo números válidos.";
    return null;
  }

  mensaje.textContent = ""; // Limpiar mensaje
  return { num1, num2 };
}

// Función para sumar
function sumar() {
  let valores = obtenerValores();
  if (!valores) return;
  document.getElementById("resultado").value = valores.num1 + valores.num2;
}

// Función para restar
function restar() {
  let valores = obtenerValores();
  if (!valores) return;
  document.getElementById("resultado").value = valores.num1 - valores.num2;
}

// Función para multiplicar
function multiplicar() {
  let valores = obtenerValores();
  if (!valores) return;
  document.getElementById("resultado").value = valores.num1 * valores.num2;
}

// Función para dividir
function dividir() {
  let valores = obtenerValores();
  if (!valores) return;

  if (valores.num2 === 0) {
    document.getElementById("mensaje").textContent = "⚠️ No se puede dividir entre cero.";
    return;
  }

  document.getElementById("resultado").value = valores.num1 / valores.num2;
}
