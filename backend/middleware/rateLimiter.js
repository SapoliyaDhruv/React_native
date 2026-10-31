// Lightweight In-Memory Sliding Window Rate Limiter
const rateLimitMap = new Map();

// Helper to determine if the request is from a local/development client
const isLocalIp = (ip) => {
  if (!ip) return true;
  const cleanIp = ip.replace(/^.*:/, ''); // strip IPv6 prefix if present
  return (
    cleanIp === '1' ||
    cleanIp === '127.0.0.1' ||
    cleanIp === 'localhost' ||
    ip === '::1' ||
    ip === '::ffff:127.0.0.1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.')
  );
};

// Default cleanup interval: every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
  const maxRequests = options.max || 1000; // generous default max requests per window
  const message = options.message || 'Too many requests from this IP. Please try again after 15 minutes.';

  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown-ip';

    // 1. Bypass rate limiting completely in development or for local network requests
    if (process.env.NODE_ENV !== 'production' || isLocalIp(ip)) {
      return next();
    }

    // 2. Bypass rate limiting for reading educational content (textbooks, sample papers, PDFs)
    const url = req.originalUrl || req.url || '';
    if (
      url.includes('textbook-view') ||
      url.includes('render') ||
      url.includes('/pdf') ||
      url.includes('/curriculum')
    ) {
      return next();
    }

    const key = `${ip}_${req.baseUrl || ''}`;
    const now = Date.now();

    let record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      rateLimitMap.set(key, record);
      return next();
    }

    record.count += 1;

    if (record.count > maxRequests) {
      return res.status(429).json({
        error: message,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
};

// Explicit function to clear rate limits (e.g. on server restart or development reset)
const clearAllRateLimits = () => {
  rateLimitMap.clear();
};

module.exports = { createRateLimiter, clearAllRateLimits };
