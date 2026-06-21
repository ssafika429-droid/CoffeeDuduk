const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const seedProducts = [
  {
    name: 'Espresso',
    price: 25000,
    stock: 50,
    description: 'Kopi espresso klasik yang kuat dan beraroma. Dibuat dari biji kopi pilihan yang disangrai sempurna.',
    imageUrl: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMGNvZmZlZSUyMGN1cHxlbnwxfHx8fDE3ODE2MzczMjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Cappuccino',
    price: 32000,
    stock: 45,
    description: 'Perpaduan sempurna antara espresso, susu panas, dan busa susu yang creamy dengan latte art yang indah.',
    imageUrl: 'https://images.unsplash.com/photo-1506372023823-741c83b836fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBwdWNjaW5vJTIwY29mZmVlJTIwYXJ0fGVufDF8fHx8MTc4MTY2ODMwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Cafe Latte',
    price: 35000,
    stock: 40,
    description: 'Espresso yang dicampur dengan susu steamed yang lembut. Sempurna untuk yang menyukai kopi dengan rasa susu yang lebih dominan.',
    imageUrl: 'https://images.unsplash.com/photo-1533776992670-a72f4c28235e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMGNvZmZlZSUyMGN1cHxlbnwxfHx8fDE3ODE1Mzk5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Americano',
    price: 28000,
    stock: 55,
    description: 'Espresso yang dicampur dengan air panas. Kopi hitam yang sempurna untuk Anda yang suka kopi tanpa susu.',
    imageUrl: 'https://images.unsplash.com/photo-1669872484166-e11b9638b50e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbm8lMjBibGFjayUyMGNvZmZlZXxlbnwxfHx8fDE3ODE2NjgzMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Mocha',
    price: 38000,
    stock: 35,
    description: 'Kombinasi lezat antara espresso, cokelat, dan susu steamed. Pilihan sempurna untuk pecinta cokelat.',
    imageUrl: 'https://images.unsplash.com/photo-1618576230663-9714aecfb99a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2NoYSUyMGNob2NvbGF0ZSUyMGNvZmZlZXxlbnwxfHx8fDE3ODE2NjgzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Caramel Macchiato',
    price: 40000,
    stock: 30,
    description: 'Espresso dengan vanilla, susu steamed, dan drizzle caramel di atasnya. Manis dan creamy.',
    imageUrl: 'https://images.unsplash.com/photo-1580661869408-55ab23f2ca6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNjaGlhdG8lMjBjb2ZmZWUlMjBzbWFsbHxlbnwxfHx8fDE3ODE2NjgzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

async function seedDatabase(_req, res) {
  try {
    const [[existingProducts]] = await pool.query('SELECT COUNT(*) AS count FROM products');
    if (existingProducts.count > 0) {
      return res.json({ message: 'Products already exist', count: Number(existingProducts.count) });
    }

    for (const product of seedProducts) {
      await pool.query(
        'INSERT INTO products (nama_produk, harga, stok, deskripsi, gambar) VALUES (?, ?, ?, ?, ?)',
        [product.name, product.price, product.stock, product.description, product.imageUrl],
      );
    }

    const [[existingAdmin]] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE email = 'admin@kopiduduk.com'");
    if (!existingAdmin.count) {
      const password = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin KopiDuduk', 'admin@kopiduduk.com', password, 'admin'],
      );
    }

    return res.status(201).json({ message: 'Seed completed', count: seedProducts.length });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: 'Seed failed' });
  }
}

module.exports = {
  seedDatabase,
};
