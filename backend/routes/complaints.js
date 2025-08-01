const express = require('express');
const jwt = require('jsonwebtoken');
const Complaint = require('../models/Complaint');

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

// POST / - submit new complaint
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'All fields required.' });
    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      description,
      status: 'Open',
    });
    res.json(complaint);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET / - get all complaints by logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(complaints);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /:id/status - mark as Closed
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, user: req.user.id });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });
    complaint.status = 'Closed';
    await complaint.save();
    res.json(complaint);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Seed complaints for demo/testing
router.get('/seed', auth, async (req, res) => {
  try {
    const count = await Complaint.countDocuments({ user: req.user.id });
    if (count === 0) {
      await Complaint.create([
        { user: req.user.id, title: 'Leaking Tap', description: 'The kitchen tap is leaking continuously.', status: 'Open' },
        { user: req.user.id, title: 'Noisy Neighbors', description: 'Loud music from apartment 302 every night.', status: 'Closed' },
        { user: req.user.id, title: 'Broken Elevator', description: 'Elevator A is not working since yesterday.', status: 'Open' }
      ]);
      return res.json({ message: 'Seeded complaints.' });
    } else {
      return res.json({ message: 'Complaints already exist.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to seed complaints.' });
  }
});

module.exports = router; 