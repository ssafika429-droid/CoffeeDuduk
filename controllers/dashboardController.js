const pool = require('../config/db');

async function getCustomerStats(req, res) {
  try {
    const [[orderStats]] = await pool.query(
      'SELECT COUNT(*) AS totalOrders, COALESCE(SUM(total), 0) AS totalSpending FROM orders WHERE user_id = ?',
      [req.user.id],
    );
    const [[favorite]] = await pool.query(
      `SELECT p.nama_produk AS favoriteCoffee, SUM(oi.jumlah) AS total
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = ?
       GROUP BY p.id, p.nama_produk
       ORDER BY total DESC
       LIMIT 1`,
      [req.user.id],
    );

    return res.json({
      stats: {
        totalOrders: Number(orderStats.totalOrders),
        totalSpending: Number(orderStats.totalSpending),
        favoriteCoffee: favorite?.favoriteCoffee || '-',
      },
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    return res.status(500).json({ error: 'Failed to get stats' });
  }
}

async function getAdminStats(_req, res) {
  try {
    const [[products]] = await pool.query('SELECT COUNT(*) AS totalProducts FROM products');
    const [[orders]] = await pool.query(
      `SELECT
        COUNT(*) AS totalOrders,
        COALESCE(SUM(total), 0) AS totalRevenue,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingOrders
       FROM orders`,
    );
    const [[customers]] = await pool.query("SELECT COUNT(*) AS totalCustomers FROM users WHERE role = 'customer'");

    return res.json({
      stats: {
        totalProducts: Number(products.totalProducts),
        totalOrders: Number(orders.totalOrders),
        totalRevenue: Number(orders.totalRevenue),
        totalCustomers: Number(customers.totalCustomers),
        pendingOrders: Number(orders.pendingOrders || 0),
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return res.status(500).json({ error: 'Failed to get stats' });
  }
}

module.exports = {
  getCustomerStats,
  getAdminStats,
};
