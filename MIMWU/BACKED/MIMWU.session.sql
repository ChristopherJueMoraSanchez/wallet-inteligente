CREATE DATABASE IF NOT EXISTS mimwu;
USE mimwu;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255)
);

CREATE TABLE cuentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nombre VARCHAR(100),
    tipo VARCHAR(50),
    saldo DECIMAL(10,2),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE transacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cuenta_id INT,
    tipo ENUM('Ingreso','Egreso'),
    categoria VARCHAR(100),
    monto DECIMAL(10,2),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cuenta_id) REFERENCES cuentas(id)
);

CREATE TABLE tarjetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    cuenta_id INT NOT NULL,
    tipo ENUM("debito", "credito") NOT NULL,
    numero VARCHAR(20),
    limite DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (cuenta_id) REFERENCES cuentas(id)
);


INSERT INTO usuarios (nombre, email, password_hash)
VALUES ('Admin', 'admin@mimwu.com', '$2b$12$z1kJYdF0PzuvX4aFgJh1AeMWBz.z.4M2IT9D6V6rbzJzq5B8nmV9i'); -- Contraseña: admin123