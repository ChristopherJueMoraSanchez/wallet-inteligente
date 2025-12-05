const backendUrl = "http://127.0.0.1:5000";

// ---------------------- SESIÓN ----------------------
function logout() {
  localStorage.removeItem("user");
  alert("Sesión cerrada");
  window.location.href = "login.html";
}

// ---------------------- CUENTAS ----------------------
async function loadAccounts() {
  const accountsDiv = document.getElementById("accounts");
  accountsDiv.innerHTML = "Cargando cuentas...";

  try {
    const res = await fetch(`${backendUrl}/cuentas`);
    const cuentas = await res.json();

    if (!res.ok) throw new Error("Error al obtener cuentas.");

    if (cuentas.length === 0) {
      accountsDiv.innerHTML = "<p>No hay cuentas registradas.</p>";
      return;
    }

    accountsDiv.innerHTML = cuentas
      .map(
        (c) => `
          <div class="account">
            <h3>${c.nombre}</h3>
            <p>Tipo: ${c.tipo}</p>
            <p>Saldo: $${c.saldo}</p>
          </div>
        `
      )
      .join("");
  } catch (err) {
    console.error(err);
    accountsDiv.innerHTML = "<p>Error al cargar cuentas.</p>";
  }
}

// ---------------------- TRANSACCIONES ----------------------
async function loadTransactions() {
  try {
    const res = await fetch(`${backendUrl}/transacciones`);
    const transacciones = await res.json();

    if (!res.ok) throw new Error("Error al obtener transacciones.");

    console.table(transacciones);
    alert(`Se obtuvieron ${transacciones.length} transacciones (ver consola).`);
  } catch (err) {
    console.error(err);
    alert("Error al cargar transacciones.");
  }
}

// ---------------------- ANÁLISIS IA ----------------------
async function loadAnalytics() {
  const resultDiv = document.getElementById("ai-results");
  resultDiv.innerHTML = "Analizando...";

  try {
    const res = await fetch(`${backendUrl}/analytics`);
    const data = await res.json();

    if (!res.ok) throw new Error("Error al obtener análisis.");

    resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "<p>Error al analizar movimientos.</p>";
  }
}

// ---------------------- GRAFICOS ----------------------
let saldoChart = null;
let tipoChart = null;

async function loadCharts() {
  try {
    const res = await fetch(`${backendUrl}/cuentas`);
    const cuentas = await res.json();

    if (!res.ok) throw new Error("Error al obtener cuentas.");

    if (cuentas.length === 0) {
      console.warn("No hay cuentas para graficar.");
      return;
    }

    // Datos para el gráfico principal de saldos
    const labels = cuentas.map((c) => c.nombre);
    const saldos = cuentas.map((c) => c.saldo);

    // Datos para gráfico de pastel (por tipo)
    const tipos = {};
    cuentas.forEach((c) => {
      tipos[c.tipo] = (tipos[c.tipo] || 0) + 1;
    });

    // ---- Limpiar gráficos anteriores ----
    if (saldoChart) saldoChart.destroy();
    if (tipoChart) tipoChart.destroy();

    // ---- GRAFICO 1: SALDO POR CUENTA ----
    saldoChart = new Chart(document.getElementById("gastosChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Saldo por cuenta",
            data: saldos,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 900,
          easing: "easeOutBounce",
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // ---- GRAFICO 2: TIPO DE CUENTA (PASTEL) ----
    tipoChart = new Chart(document.getElementById("ingresosChart"), {
      type: "pie",
      data: {
        labels: Object.keys(tipos),
        datasets: [
          {
            label: "Tipo de cuentas",
            data: Object.values(tipos),
            backgroundColor: [
              "rgba(255,99,132,0.6)",
              "rgba(54,162,235,0.6)",
              "rgba(255,206,86,0.6)",
              "rgba(75,192,192,0.6)",
              "rgba(153,102,255,0.6)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 800,
          easing: "easeInOutQuart",
        },
      },
    });
  } catch (err) {
    console.error("Error al cargar gráficos:", err);
  }
}

// ---- BOTÓN PARA ACTUALIZAR GRÁFICAS ----
function actualizarGraficos() {
  loadCharts();
  alert("Gráficas actualizadas");
}

// Crear cuenta bancaria
document.getElementById("createAccountForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));

  const newAccount = {
    usuario_id: user.usuario.id,
    nombre: document.getElementById("accountName").value,
    tipo: document.getElementById("accountType").value,
    saldo: document.getElementById("accountBalance").value,
  };

  const res = await fetch(`${backendUrl}/cuentas/crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAccount),
  });

  const data = await res.json();

  if (res.ok) {
    alert("Cuenta registrada correctamente.");
    loadAccounts();
    loadCharts();
  } else {
    alert("Error al registrar la cuenta.");
    console.error(data);
  }
});


// ---------------------- AUTO EJECUCIÓN ----------------------
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("accounts")) {
    loadAccounts();
    loadCharts();
  }
});