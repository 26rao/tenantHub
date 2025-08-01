const express = require('express');
const jwt = require('jsonwebtoken');
const Rent = require('../models/Rent');

const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token is not valid.' });
  }
}

// GET / - fetch rent records for logged-in user, filter by month/year
router.get('/', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { user: req.user.id };
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    const rentRecords = await Rent.find(filter).sort({ year: -1, month: -1 });
    res.json(rentRecords);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 