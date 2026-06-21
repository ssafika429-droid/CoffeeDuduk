const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'kopiduduk_dev_secret');
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }

  return next();
}

function requireCustomer(req, res, next) {
  if (req.user?.role !== 'customer') {
    return res.status(403).json({ error: 'Forbidden - Customer access required' });
  }

  return next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireCustomer,
};
