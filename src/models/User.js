const db = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async create({ email, name, documentNumber, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO usuarios(email, name, document_number, password_hash) VALUES($1, $2, $3, $4) RETURNING *";
    const values = [email, name, documentNumber, hashedPassword];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = "SELECT * FROM usuarios WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = User;
