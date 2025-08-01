const express = require('express');
const jwt = require('jsonwebtoken');
const Notice = require('../models/Notice');

const router = express.Router();

// Middleware to verify JWT
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

// GET all notices
router.get('/', auth, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 