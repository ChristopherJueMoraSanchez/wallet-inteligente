import pandas as pd
from sklearn.ensemble import IsolationForest
from db import get_connection

def analizar_transacciones():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM cuentas")
    cuentas = cursor.fetchall()

    cursor.execute("SELECT * FROM transacciones")
    trans = cursor.fetchall()

    gastos = [t["monto"] for t in trans if t["tipo"] == "gasto"]
    ingresos = [t["monto"] for t in trans if t["tipo"] == "ingreso"]

    total_gastos = sum(gastos)
    total_ingresos = sum(ingresos)
    saldo_total = sum(c["saldo"] for c in cuentas)

    recomendaciones = []

    if total_gastos > total_ingresos:
        recomendaciones.append("Estás gastando más de lo que ganas. Reduce compras innecesarias.")
    if saldo_total < 100:
        recomendaciones.append("Tu saldo es muy bajo. Considera ahorrar más.")
    if total_gastos > (total_ingresos * 0.7):
        recomendaciones.append("Tus gastos superan el 70% de tus ingresos. Riesgo financiero.")
    if len(cuentas) >= 3:
        recomendaciones.append("Diversificación adecuada entre cuentas.")

    return {
        "saldo_total": saldo_total,
        "ingresos": total_ingresos,
        "gastos": total_gastos,
        "recomendaciones": recomendaciones
    }