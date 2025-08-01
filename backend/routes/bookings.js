const express = require('express');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
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

// Get all bookings
router.get('/', auth, async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

// Create a booking
router.post('/', auth, async (req, res) => {
  const { service, day, slot } = req.body;
  if (!service || day == null || slot == null) return res.status(400).json({ message: 'Missing fields.' });
  // Prevent double booking
  const exists = await Booking.findOne({ service, day, slot });
  if (exists) return res.status(409).json({ message: 'Slot already booked.' });
  const booking = await Booking.create({ user: req.user.id, service, day, slot });
  res.json(booking);
});

module.exports = router; 