const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign({ email: user.email, userId: user._id }, 'adjalskjdlakjsdlkasjdlaskdjlaksjdl', { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    return decoded;
  } catch (error) {
    return null; // Token verification failed
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
