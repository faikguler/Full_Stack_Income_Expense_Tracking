const jwt = require('jsonwebtoken');

const secret = process.env.SESSION_SECRET || 'mysecretsshhhhhh';
const expiration = '2h';

const authMiddleware = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return res.status(401).json({ message: 'Bearer Token not supplied or invalid' });
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
    next();
  } catch (err) {
    console.log('Invalid token');
    return res.status(401).json({ message: 'Invalid token: ' + err.message });
  }
};

const signToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = { authMiddleware, signToken };