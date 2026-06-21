const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authenticateToken, requireAdmin, requireCustomer } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, requireCustomer, createOrder);
router.get('/', authenticateToken, requireAdmin, getAllOrders);
router.get('/my-orders', authenticateToken, requireCustomer, getMyOrders);
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

module.exports = router;
