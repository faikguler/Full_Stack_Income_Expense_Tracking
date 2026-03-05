// routes/index.js
const router = require('express').Router();
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
const transactionRoutes = require('./transactionRoutes');

router.get('/api/test', (req, res) => {
  res.json({ message: 'The server is up and running! The API connected successfully.' });
});

router.get('/', (req, res) => {
  res.send(`
    <h1>Income Expense Application</h1>
    <p>Server is running successfully!</p>
    <p>For API testing: <a href="/api/test">/api/test</a></p>
  `);
});

router.use('/api/users', userRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/transactions', transactionRoutes);

router.use((req, res) => {
  res.status(404).json({ message: 'Page not found' });
});

module.exports = router;