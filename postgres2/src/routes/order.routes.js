import express from 'express';
import { createOrder, getOrder, cancelOrder } from '../controllers/order.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/:id', authenticateToken, getOrder);
router.post('/:id/cancel', authenticateToken, cancelOrder);

export default router; 