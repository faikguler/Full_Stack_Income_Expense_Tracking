const router = require('express').Router();
const { Transaction, Category } = require('../models');
const { authMiddleware } = require('../utils/auth');
const { Op } = require('sequelize');

router.get('/', authMiddleware, async (req, res) => {
  try {

    const whereClause = { user_id: req.user.id };

    if (req.query.type) {
      whereClause.type = req.query.type;
    }

    if (req.query.category_id) {
      whereClause.category_id = req.query.category_id;
    }
    
    
    const transactions = await Transaction.findAll({
      where: whereClause,
      include: [{ model: Category, attributes: ['name', 'type'] }],
      order: [['date', 'DESC']],
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      include: [{ model: Category, attributes: ['name', 'type'] }],
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      user_id: req.user.id,
    };
    const transaction = await Transaction.create(transactionData);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });
    if (!transaction[0]) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction updated successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.destroy({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/report/range', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, type, category_id } = req.query;
    
    const whereClause = {
      user_id: req.user.id,
      date: {
        [Op.between]: [startDate, endDate],
      },
    };
    
    if (type) {
      whereClause.type = type;
    }
    
    if (category_id) {
      whereClause.category_id = category_id;
    }
    
    const transactions = await Transaction.findAll({
      where: whereClause,
      include: [{ model: Category, attributes: ['name'] }],
      order: [['date', 'ASC']],
    });
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += parseFloat(t.amount);
      } else {
        totalExpense += parseFloat(t.amount);
      }
    });
    
    res.json({
      transactions,
      summary: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;