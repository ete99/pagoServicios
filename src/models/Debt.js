const db = require("../config/database");

class Debt {
  static async create({ referenceNumber, serviceCode, totalAmount }) {
    const query = `
        INSERT INTO deudas(numero_referencia_comprobante, codigo_servicio, monto_total) 
        VALUES($1, $2, $3)
        RETURNING *
        `;
    const values = [referenceNumber, serviceCode, totalAmount];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByReferenceNumber(referenceNumber) {
    const query =
      "SELECT * FROM deudas WHERE numero_referencia_comprobante = $1 ORDER BY created_at DESC";
    const result = await db.query(query, [referenceNumber]);
    return result.rows;
  }

  static async findByServiceCode(referenceNumber, serviceCode) {
    const query = `
        SELECT * FROM deudas 
        WHERE numero_referencia_comprobante = $1 
        AND codigo_servicio = $2
        ORDER BY created_at DESC
        `;
    const result = await db.query(query, [referenceNumber, serviceCode]);
    return result.rows;
  }

  static async findById(id) {
    const query = "SELECT * FROM deudas WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Debt;
