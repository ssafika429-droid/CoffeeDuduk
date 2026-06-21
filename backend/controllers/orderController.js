const pool = require('../config/db');

function toOrder(row, items = []) {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    items,
    total: Number(row.total),
    status: row.status,
    customerName: row.customer_name || row.nama || '',
    tableNumber: row.table_number || '',
    createdAt: row.tanggal,
  };
}

async function getOrderItems(orderIds) {
  if (!orderIds.length) return new Map();

  const [rows] = await pool.query(
    `SELECT
      oi.order_id,
      oi.product_id,
      oi.jumlah,
      oi.subtotal,
      p.nama_produk,
      p.harga,
      p.gambar
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id IN (?)`,
    [orderIds],
  );

  const grouped = new Map();
  for (const row of rows) {
    const key = String(row.order_id);
    const items = grouped.get(key) || [];
    items.push({
      productId: String(row.product_id),
      name: row.nama_produk,
      price: Number(row.harga),
      quantity: Number(row.jumlah),
      subtotal: Number(row.subtotal),
      imageUrl: row.gambar,
    });
    grouped.set(key, items);
  }

  return grouped;
}

async function createOrder(req, res) {
  const connection = await pool.getConnection();

  try {
    const { items, total, customerName, tableNumber } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total, status, customer_name, table_number) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, Number(total), 'pending', customerName || null, tableNumber || null],
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const [products] = await connection.query(
        'SELECT id, harga, stok FROM products WHERE id = ? FOR UPDATE',
        [item.productId],
      );
      const product = products[0];

      if (!product) {
        await connection.rollback();
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      if (Number(product.stok) < Number(item.quantity)) {
        await connection.rollback();
        return res.status(400).json({ error: `Insufficient stock for product ${item.productId}` });
      }

      const subtotal = Number(product.harga) * Number(item.quantity);
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, jumlah, subtotal) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, Number(item.quantity), subtotal],
      );
      await connection.query(
        'UPDATE products SET stok = stok - ? WHERE id = ?',
        [Number(item.quantity), item.productId],
      );
    }

    await connection.commit();

    return res.status(201).json({
      order: {
        id: String(orderId),
        userId: String(req.user.id),
        items,
        total: Number(total),
        status: 'pending',
        customerName,
        tableNumber,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  } finally {
    connection.release();
  }
}

async function listOrders(whereSql = '', params = []) {
  const [rows] = await pool.query(
    `SELECT o.*, u.nama
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ${whereSql}
     ORDER BY o.tanggal DESC`,
    params,
  );
  const itemMap = await getOrderItems(rows.map((order) => order.id));
  return rows.map((order) => toOrder(order, itemMap.get(String(order.id)) || []));
}

async function getMyOrders(req, res) {
  try {
    const orders = await listOrders('WHERE o.user_id = ?', [req.user.id]);
    return res.json({ orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    return res.status(500).json({ error: 'Failed to get orders' });
  }
}

async function getAllOrders(_req, res) {
  try {
    const orders = await listOrders();
    return res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({ error: 'Failed to get orders' });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const allowed = ['pending', 'processing', 'ready', 'completed'];
    const { status } = req.body;

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [orders] = await listOrders('WHERE o.id = ?', [req.params.id]);
    return res.json({ order: orders });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
