// routes/userRoutes.js
const router = require('express').Router();
const { User } = require('../models');
const { signToken, authMiddleware } = require('../utils/auth');

// GET /api/users/me - current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/register', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    const token = signToken(userData);
    res.json({ token, user: userData });
  } catch (err) {
    res.status(400).json(err);
  }
});


router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    const token = signToken(userData);
    res.json({ token, user: userData });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;