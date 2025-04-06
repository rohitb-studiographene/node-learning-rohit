import z from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().positive(),
  stock: z.number().int().min(0)
});

export const updateProductSchema = createProductSchema.partial(); 