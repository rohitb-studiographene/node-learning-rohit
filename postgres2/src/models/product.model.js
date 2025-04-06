import db from '../config/database.js';

export const ProductModel = {
  async create(productData) {
    const query = `
      INSERT INTO products (name, price, stock)
      VALUES ($1, $2, $3)
      RETURNING id, name, price, stock, created_at;
    `;
    const values = [productData.name, productData.price, productData.stock];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const query = `
      SELECT id, name, price, stock, created_at
      FROM products
      ORDER BY created_at DESC;
    `;
    const result = await db.query(query);
    return result.rows;
  },

  async findById(id) {
    const query = `
      SELECT id, name, price, stock, created_at
      FROM products
      WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, productData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (productData.name) {
      fields.push(`name = $${paramCount}`);
      values.push(productData.name);
      paramCount++;
    }

    if (productData.price !== undefined) {
      fields.push(`price = $${paramCount}`);
      values.push(productData.price);
      paramCount++;
    }

    if (productData.stock !== undefined) {
      fields.push(`stock = $${paramCount}`);
      values.push(productData.stock);
      paramCount++;
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, price, stock, created_at;
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = `
      DELETE FROM products
      WHERE id = $1
      RETURNING id;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async checkStock(productId, quantity) {
    const query = `
      SELECT stock >= $2 as has_stock
      FROM products
      WHERE id = $1;
    `;
    const result = await db.query(query, [productId, quantity]);
    return result.rows[0]?.has_stock || false;
  },

  async updateStock(productId, quantity, increment = false) {
    const query = `
      UPDATE products
      SET stock = stock ${increment ? '+' : '-'} $2
      WHERE id = $1 AND (${increment ? 'TRUE' : 'stock >= $2'})
      RETURNING stock;
    `;
    const result = await db.query(query, [productId, quantity]);
    return result.rows[0];
  }
};

export default ProductModel; 