const db = require("../config/database");

class Payment {
  static async create({ userId, debtId, amountPaid }) {
    const query = `
      INSERT INTO pagos(user_id, deuda_id, monto) 
      VALUES($1, $2, $3)
      RETURNING *
    `;
    const values = [userId, debtId, amountPaid];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query =
      "SELECT * FROM pagos WHERE user_id = $1 ORDER BY fecha_pago DESC";
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async findByDateRange(userId, startDate, endDate) {
    const query = `
      SELECT * FROM pagos
      WHERE user_id = $1 AND fecha_pago BETWEEN $2 AND $3
      ORDER BY fecha_pago DESC
    `;
    const result = await db.query(query, [userId, startDate, endDate]);
    return result.rows;
  }

  static async findByService(userId, serviceId) {
    const query = `
      SELECT p.id, p.user_id, p.deuda_id, p.monto, p.fecha_pago, p.created_at, p.updated_at, d.monto_total, d.estado_pago 
      FROM pagos p 
      JOIN deudas d 
      ON p.deuda_id = d.id 
      WHERE p.user_id = $1 
      AND d.codigo_servicio = $2 ORDER 
      BY p.fecha_pago DESC
    `;

    const result = await db.query(query, [userId, serviceId]);
    return result.rows;
  }
}

module.exports = Payment;
