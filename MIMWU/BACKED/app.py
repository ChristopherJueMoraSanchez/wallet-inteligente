from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime

app = Flask(__name__)
CORS(app)

# -----------------------------------------------
# CONEXIÓN A BASE DE DATOS
# -----------------------------------------------
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="tu_contraseña",
        database="mimwu"
    )

# -----------------------------------------------
# REGISTRO DE USUARIO
# -----------------------------------------------
@app.route("/registro", methods=["POST"])
def registro():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO usuarios (nombre, correo, contraseña) VALUES (%s, %s, %s)",
        (data["nombre"], data["correo"], data["contraseña"])
    )

    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Usuario registrado correctamente"})

# -----------------------------------------------
# LOGIN
# -----------------------------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM usuarios WHERE correo = %s AND contraseña = %s",
        (data["correo"], data["contraseña"])
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"success": True, "usuario_id": user["id"]})
    else:
        return jsonify({"success": False, "message": "Credenciales incorrectas"})

# -----------------------------------------------
# CREAR CUENTA BANCARIA
# -----------------------------------------------
@app.route("/cuentas/crear", methods=["POST"])
def crear_cuenta():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO cuentas (usuario_id, nombre, tipo, saldo)
        VALUES (%s, %s, %s, %s)
    """, (data["usuario_id"], data["nombre"], data["tipo"], data["saldo"]))

    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Cuenta creada correctamente"})

# -----------------------------------------------
# LISTAR CUENTAS DEL USUARIO
# -----------------------------------------------
@app.route("/cuentas/<int:usuario_id>", methods=["GET"])
def obtener_cuentas(usuario_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM cuentas WHERE usuario_id = %s", (usuario_id,))
    cuentas = cursor.fetchall()

    conn.close()
    return jsonify(cuentas)

# -----------------------------------------------
# REGISTRAR TARJETA
# -----------------------------------------------
@app.route("/tarjetas/crear", methods=["POST"])
def crear_tarjeta():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO tarjetas (usuario_id, numero, tipo, limite)
        VALUES (%s, %s, %s, %s)
        """,
        (data["usuario_id"], data["numero"], data["tipo"], data["limite"])
    )

    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Tarjeta registrada con éxito"})

# -----------------------------------------------
# TRANSFERENCIA ENTRE CUENTAS
# -----------------------------------------------
@app.route("/transferencias", methods=["POST"])
def transferir():
    data = request.json

    origen = data["origen"]
    destino = data["destino"]
    monto = float(data["monto"])

    conn = get_connection()
    cursor = conn.cursor()

    # Verificar saldo
    cursor.execute("SELECT saldo FROM cuentas WHERE id = %s", (origen,))
    saldo_origen = cursor.fetchone()[0]

    if saldo_origen < monto:
        return jsonify({"success": False, "message": "Saldo insuficiente"})

    # Descontar origen
    cursor.execute("UPDATE cuentas SET saldo = saldo - %s WHERE id = %s", (monto, origen))

    # Sumar destino
    cursor.execute("UPDATE cuentas SET saldo = saldo + %s WHERE id = %s", (monto, destino))

    # Guardar transacción
    cursor.execute(
        """
        INSERT INTO transacciones (cuenta_id, tipo, monto, fecha)
        VALUES (%s, 'transferencia', %s, %s)
        """,
        (origen, monto, datetime.now())
    )

    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Transferencia realizada correctamente"})

# -----------------------------------------------
# OBTENER TRANSACCIONES PARA GRÁFICAS
# -----------------------------------------------
@app.route("/transacciones/<int:usuario_id>", methods=["GET"])
def obtener_transacciones(usuario_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT t.*, c.nombre AS cuenta
        FROM transacciones t
        JOIN cuentas c ON t.cuenta_id = c.id
        WHERE c.usuario_id = %s
    """, (usuario_id,))

    data = cursor.fetchall()
    conn.close()

    return jsonify(data)

# -----------------------------------------------
# INTELIGENCIA FINANCIERA BÁSICA
# -----------------------------------------------
@app.route("/analisis/<int:usuario_id>", methods=["GET"])
def analisis(usuario_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            SUM(CASE WHEN monto < 0 THEN monto ELSE 0 END) AS gastos,
            SUM(CASE WHEN monto > 0 THEN monto ELSE 0 END) AS ingresos
        FROM transacciones t
        JOIN cuentas c ON t.cuenta_id = c.id
        WHERE c.usuario_id = %s
    """, (usuario_id,))

    datos = cursor.fetchone()
    conn.close()

    return jsonify(datos)

# -----------------------------------------------
# INICIO DEL SERVIDOR
# -----------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
