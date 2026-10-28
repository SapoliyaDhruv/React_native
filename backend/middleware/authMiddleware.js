const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mindsprint_secret';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    // If route requires strict auth, or fallback to body email for backwards compatibility with offline-first client
    if (req.body && req.body.email) {
      req.user = { email: req.body.email };
      return next();
    }
    return res.status(401).json({ error: 'Access denied. Authentication token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // If token invalid, verify if body email is provided as local fallback
    if (req.body && req.body.email) {
      req.user = { email: req.body.email };
      return next();
    }
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = { authenticateToken };
