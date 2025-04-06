import db from '../config/database.js';

export const UserModel = {
  async create(userData) {
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at;
    `;
    const values = [userData.name, userData.email, userData.password];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = `
      SELECT id, name, email, password, created_at
      FROM users
      WHERE email = $1;
    `;
    const result = await db.query(query, [email]);
    return result.rows[0];
  },

  async findById(id) {
    const query = `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, userData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (userData.name) {
      fields.push(`name = $${paramCount}`);
      values.push(userData.name);
      paramCount++;
    }

    if (userData.email) {
      fields.push(`email = $${paramCount}`);
      values.push(userData.email);
      paramCount++;
    }

    if (userData.password) {
      fields.push(`password = $${paramCount}`);
      values.push(userData.password);
      paramCount++;
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, created_at;
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
};

export default UserModel; 