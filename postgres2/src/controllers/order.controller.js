import OrderModel from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";
import { createOrderSchema } from "../schemas/order.schema.js";
import db from "../config/database.js";

export const createOrder = async (req, res) => {
  try {
    const { items } = createOrderSchema.parse(req.body);
    const userId = req.user.id;

    // Start transaction
    await db.query("BEGIN");

    try {
      let totalPrice = 0;

      // First check if all products have enough stock
      for (const item of items) {
        const product = await ProductModel.findById(item.productId);

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        // Use checkStock method to verify availability
        const hasStock = await ProductModel.checkStock(
          item.productId,
          item.quantity
        );
        if (!hasStock) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        totalPrice += product.price * item.quantity;
      }

      // Create order
      const order = await OrderModel.createOrder(userId, totalPrice);

      // Create order items and update stock using updateStock method
      for (const item of items) {
        await OrderModel.createOrderItem(
          order.id,
          item.productId,
          item.quantity
        );
        // Use updateStock to decrease inventory
        await ProductModel.updateStock(item.productId, item.quantity);
      }

      // Commit transaction
      await db.query("COMMIT");

      const orderDetails = await OrderModel.getOrderById(order.id);
      res.status(201).json(orderDetails);
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    res.status(400).json({ error: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await OrderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new endpoint to handle order cancellations
export const cancelOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = req.user.id;

    await db.query("BEGIN");

    try {
      // Get order details
      const order = await OrderModel.getOrderById(orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      // Verify user owns this order
      if (order.user_id !== userId) {
        throw new Error("Unauthorized to cancel this order");
      }

      // Restore stock for each item using updateStock
      for (const item of order.items) {
        // Use updateStock with increment=true to restore stock
        await ProductModel.updateStock(item.product_id, item.quantity, true);
      }

      // Mark order as cancelled in database
      await OrderModel.cancelOrder(orderId);

      await db.query("COMMIT");
      res.json({ message: "Order cancelled successfully" });
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
