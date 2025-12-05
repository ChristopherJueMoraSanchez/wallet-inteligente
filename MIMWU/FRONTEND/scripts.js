const backendUrl = "http://127.0.0.1:5000"; // Asegúrate de que Flask corre ahí

// ---- LOGIN ----
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Por favor completa todos los campos.");
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Inicio de sesión exitoso");
          // Guardar sesión local
          localStorage.setItem("user", JSON.stringify(data));
          window.location.href = "dashboard.html";
        } else {
          alert(data.message || "Error al iniciar sesión");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
      }
    });
  }
});

// ---- REGISTRO ----
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const res = await fetch(`${backendUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: name, email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Usuario registrado correctamente.");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Error en el registro.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
      }
    });
  }
});

// ---- DASHBOARD ----
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const cuentasBtn = document.getElementById("verCuentas");
  const analizarBtn = document.getElementById("analizarMovimientos");

  // Si no hay sesión, redirige al login
  if (!user && (cuentasBtn || analizarBtn)) {
    alert("Por favor, inicia sesión primero.");
    window.location.href = "login.html";
    return;
  }

  // --- Botón: Ver transacciones ---
  if (cuentasBtn) {
    cuentasBtn.addEventListener("click", async () => {
      try {
        const res = await fetch(`${backendUrl}/cuentas`);
        const data = await res.json();
        console.log("Cuentas:", data);
        alert(`Tienes ${data.length} cuentas registradas.`);
      } catch (err) {
        console.error(err);
        alert("Error al obtener cuentas.");
      }
    });
  }

  // --- Botón: Analizar movimientos ---
  if (analizarBtn) {
    analizarBtn.addEventListener("click", async () => {
      try {
        const res = await fetch(`${backendUrl}/analytics`);
        const data = await res.json();
        console.log("Análisis financiero:", data);
        alert("Análisis completado. Revisa la consola para ver los resultados.");
      } catch (err) {
        console.error(err);
        alert("Error al analizar movimientos.");
      }
    });
  }
});
