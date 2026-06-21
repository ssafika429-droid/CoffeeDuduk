const pool = require('../config/db');

function toProduct(row) {
  return {
    id: String(row.id),
    name: row.nama_produk,
    price: Number(row.harga),
    stock: Number(row.stok),
    description: row.deskripsi,
    imageUrl: row.gambar,
  };
}

async function getProducts(_req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
    return res.json({ products: rows.map(toProduct) });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ error: 'Failed to get products' });
  }
}

async function getProduct(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ product: toProduct(rows[0]) });
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({ error: 'Failed to get product' });
  }
}

async function createProduct(req, res) {
  try {
    const { name, price, stock, description, imageUrl } = req.body;

    const [result] = await pool.query(
      'INSERT INTO products (nama_produk, harga, stok, deskripsi, gambar) VALUES (?, ?, ?, ?, ?)',
      [name, Number(price), Number(stock), description, imageUrl],
    );

    return res.status(201).json({
      product: {
        id: String(result.insertId),
        name,
        price: Number(price),
        stock: Number(stock),
        description,
        imageUrl,
      },
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ error: 'Failed to create product' });
  }
}

async function updateProduct(req, res) {
  try {
    const { name, price, stock, description, imageUrl } = req.body;
    const [result] = await pool.query(
      'UPDATE products SET nama_produk = ?, harga = ?, stok = ?, deskripsi = ?, gambar = ? WHERE id = ?',
      [name, Number(price), Number(stock), description, imageUrl, req.params.id],
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({
      product: {
        id: String(req.params.id),
        name,
        price: Number(price),
        stock: Number(stock),
        description,
        imageUrl,
      },
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ error: 'Failed to update product' });
  }
}

async function deleteProduct(req, res) {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toProduct,
};
