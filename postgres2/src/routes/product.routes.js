import express from 'express';
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router; 