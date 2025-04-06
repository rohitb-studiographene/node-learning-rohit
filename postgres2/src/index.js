import express from 'express';
import env from './config/env.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';

const app = express();

// Middleware
app.use(express.json());

// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
}); 