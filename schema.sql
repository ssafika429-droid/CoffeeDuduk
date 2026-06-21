CREATE DATABASE IF NOT EXISTS coffeeku;
USE coffeeku;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('customer','admin')
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_produk VARCHAR(100),
  harga INT,
  stok INT,
  deskripsi TEXT,
  gambar VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
  total INT,
  status ENUM('pending','processing','ready','completed'),
  customer_name VARCHAR(100),
  table_number VARCHAR(20),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  jumlah INT,
  subtotal INT,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY(product_id) REFERENCES products(id)
);
