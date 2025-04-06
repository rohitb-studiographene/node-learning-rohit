import db from "../config/database.js";

export const OrderModel = {
  async createOrder(userId, totalPrice) {
    const query = `
      INSERT INTO orders (user_id, total_price)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const result = await db.query(query, [userId, totalPrice]);
    return result.rows[0];
  },

  async createOrderItem(orderId, productId, quantity) {
    const query = `
      INSERT INTO order_items (order_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const result = await db.query(query, [orderId, productId, quantity]);
    return result.rows[0];
  },

  async getOrderById(orderId) {
    const query = `
      SELECT 
        o.id as order_id,
        o.total_price,
        o.created_at,
        o.user_id,
        json_agg(
          json_build_object(
            'product_id', p.id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'unit_price', p.price
          )
        ) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id, o.total_price, o.created_at;
    `;
    const result = await db.query(query, [orderId]);
    return result.rows[0];
  },

  async updateProductStock(productId, quantity) {
    const query = `
      UPDATE products
      SET stock = stock - $2
      WHERE id = $1 AND stock >= $2
      RETURNING stock;
    `;
    const result = await db.query(query, [productId, quantity]);
    return result.rows[0];
  },

  async cancelOrder(orderId) {
    const query = `
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = $1
      RETURNING id;
    `;
    const result = await db.query(query, [orderId]);
    return result.rows[0];
  },
};

export default OrderModel;
