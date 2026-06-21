const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

function toUser(row) {
  return {
    id: String(row.id),
    name: row.nama,
    email: row.email,
    role: row.role,
  };
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'kopiduduk_dev_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );
}

async function register(req, res) {
  try {
    const { email, password, name, role = 'customer' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role],
    );

    const user = { id: String(result.insertId), name, email, role };
    return res.status(201).json({ user });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    console.log('EMAIL INPUT:', email);
    console.log('ROWS FOUND:', rows.length);

    const dbUser = rows[0];

    if (!dbUser) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('DB EMAIL:', dbUser.email);
    console.log('INPUT PASSWORD:', password);
    console.log('HASH IN DB:', dbUser.password);

    const validPassword = await bcrypt.compare(
      String(password),
      String(dbUser.password)
    );

    console.log('PASSWORD MATCH:', validPassword);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = toUser(dbUser);
    const token = signToken(user);

    return res.json({
      token,
      user,
      role: user.role,
      session: {
        access_token: token,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
}

async function me(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, nama, email, role FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user: toUser(rows[0]) });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Failed to get user' });
  }
}

module.exports = {
  register,
  login,
  me,
};
