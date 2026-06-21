const express = require('express');
const { getCustomerStats, getAdminStats } = require('../controllers/dashboardController');
const { authenticateToken, requireAdmin, requireCustomer } = require('../middleware/auth');

const router = express.Router();

router.get('/customer', authenticateToken, requireCustomer, getCustomerStats);
router.get('/admin', authenticateToken, requireAdmin, getAdminStats);

module.exports = router;
