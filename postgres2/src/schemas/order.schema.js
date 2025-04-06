import z from 'zod';

export const orderItemSchema = z.object({
  productId: z.number().positive(),
  quantity: z.number().positive()
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).nonempty({
    message: "Order must contain at least one item"
  })
}); 