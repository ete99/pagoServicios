const db = require("../config/database");

class Service {
  static async create({ name, code }) {
    const query =
      "INSERT INTO servicios(nombre_servicio, codigo_servicio) VALUES($1, $2) RETURNING *";
    const values = [name, code];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByCode(code) {
    const query = "SELECT * FROM servicios WHERE codigo_servicio = $1";
    const result = await db.query(query, [code]);
    return result.rows[0];
  }

  static async findAll() {
    const query = "SELECT * FROM servicios";
    const result = await db.query(query);
    return result.rows;
  }

  static async search(term) {
    const query = "SELECT * FROM servicios WHERE nombre_servicio ILIKE $1";
    const result = await db.query(query, [`%${term}%`]);
    return result.rows;
  }
}

module.exports = Service;
