const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
});

const sqlCommands = `
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    document_number VARCHAR(20) UNIQUE NOT NULL,
    balance INTEGER DEFAULT 0 NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    constraint usuarios_balance_check CHECK (balance >= 0),
    constraint usuarios_email_check CHECK (email ~* '^.+@.+\..+$')
);

CREATE TABLE IF NOT EXISTS servicios (
    codigo_servicio INTEGER PRIMARY KEY,
    nombre_servicio VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    constraint servicios_nombre_servicio_check CHECK (nombre_servicio ~* '^[a-zA-Z0-9 ]+$')
);

CREATE TABLE IF NOT EXISTS deudas (
    id SERIAL PRIMARY KEY,
    codigo_servicio INTEGER NOT NULL, 
    numero_referencia_comprobante VARCHAR(50) NOT NULL, -- NIS o número de cédula
    monto_total INTEGER NOT NULL, -- Monto total de la deuda
    monto_pagado INTEGER DEFAULT 0 NOT NULL, -- Monto pagado
    estado_pago VARCHAR(50) NOT NULL, -- Estado del pago (Pendiente, Pagado, Anulado)
    fecha_vencimiento TIMESTAMP NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (codigo_servicio) REFERENCES servicios(codigo_servicio),
    constraint deudas_monto_total_check CHECK (monto_total > 0),
    constraint deudas_estado_pago_check CHECK (estado_pago IN ('Pendiente', 'Pagado', 'Anulado')),
    constraint deudas_fecha_vencimiento_check CHECK (fecha_vencimiento > CURRENT_TIMESTAMP),
    constraint deudas_monto_pagado_check CHECK (monto_pagado >= 0 AND monto_pagado <= monto_total)
);

CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  deuda_id INTEGER NOT NULL,
  monto INTEGER NOT NULL,
  fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id),
  FOREIGN KEY (deuda_id) REFERENCES deudas(id),
  constraint pagos_monto_check CHECK (monto > 0)
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_servicios_nombre_servicio ON servicios(nombre_servicio);
CREATE INDEX IF NOT EXISTS idx_deudas_reference_number ON deudas(numero_referencia_comprobante);
CREATE INDEX IF NOT EXISTS idx_pagos_user_id ON pagos(user_id);
`;

const loadTriggers = `
CREATE OR REPLACE FUNCTION actualizar_balance_y_estado()
RETURNS TRIGGER AS $$
BEGIN
    -- Descontar el monto del balance del usuario
    UPDATE usuarios
    SET balance = balance - NEW.monto
    WHERE id = NEW.user_id;

    -- los pagos no pueden ser mayores al monto total de la deuda * chequeado un constraint

    -- Actualizar el monto de la deuda
    UPDATE deudas
    SET monto_pagado = monto_total - NEW.monto,
        estado_pago = CASE
            WHEN (monto_total - NEW.monto) = 0 THEN 'Pagado'
            ELSE estado_pago
        END
    WHERE id = NEW.deuda_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_balance_y_estado
AFTER INSERT ON pagos
FOR EACH ROW
EXECUTE FUNCTION actualizar_balance_y_estado();
`;

// just drop everythin and recreate it
const sqlRefreshCommands = `
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;
DROP TABLE IF EXISTS deudas CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;

DROP INDEX IF EXISTS idx_usuarios_email CASCADE;
DROP INDEX IF EXISTS idx_servicios_nombre_servicio CASCADE;
DROP INDEX IF EXISTS idx_deudas_reference_number CASCADE;

DROP FUNCTION IF EXISTS actualizar_balance_y_estado CASCADE;

DROP TRIGGER IF EXISTS trigger_actualizar_balance_y_estado ON pagos CASCADE;
`;

const initializedWithFakeDataCommands = `
INSERT INTO servicios(codigo_servicio, nombre_servicio) VALUES
(1, 'Agua'),
(2, 'Luz'),
(3, 'Internet'),
(4, 'Telefono');

INSERT INTO usuarios(id, email, name, document_number, balance, password_hash) VALUES
('f7e6f1d2-1f7b-4c4d-8e5d-1e2e3b4c5d6e','juan_perez@gmail.com', 'Juan Perez', '12345678', 100000, '123456');

INSERT INTO deudas(codigo_servicio, numero_referencia_comprobante, monto_total, estado_pago, fecha_vencimiento) VALUES
(1, '123456', 50000, 'Pagado', '2025-12-31'),
(2, '1234567', 60000, 'Pagado', '2025-12-31'),
(3, '4465907', 70000, 'Pendiente', '2025-12-31');

INSERT INTO pagos(user_id, deuda_id, monto) VALUES
('f7e6f1d2-1f7b-4c4d-8e5d-1e2e3b4c5d6e', 1, 50000),
('f7e6f1d2-1f7b-4c4d-8e5d-1e2e3b4c5d6e', 2, 60000);
`;

async function initializeDatabase(reset = false) {
  const client = await pool.connect();
  try {
    if (reset) {
      console.log("Resetting database...");
      await client.query("BEGIN");
      await client.query(sqlRefreshCommands);
      await client.query("COMMIT");
      console.log("Database reset successfully");
    }

    await client.query("BEGIN");
    await client.query(sqlCommands);
    if (reset) {
      await client.query(initializedWithFakeDataCommands);
      console.log("Database initialized with fake data successfully ");
    }
    await client.query(loadTriggers);
    console.log("Triggers loaded successfully");
    await client.query("COMMIT");
    console.log("Database initialized successfully ");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error initializing database:", error);
  } finally {
    client.release();
  }
}

initializeDatabase(true);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
