const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secret';

module.exports = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};
