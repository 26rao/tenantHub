const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

const authRoutes = require('./routes/auth');
const noticesRoutes = require('./routes/notices');
const complaintsRoutes = require('./routes/complaints');
const rentRoutes = require('./routes/rent');
const bookingsRoutes = require('./routes/bookings');

const app = express();

// 🌐 CORS setup: allow Vercel frontend
app.use(cors({
  origin: 'https://tenanthub.vercel.app',
  credentials: true,
}));

// 🔧 Middlewares
app.use(express.json());

// 📦 Routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/rent', rentRoutes);
app.use('/api/bookings', bookingsRoutes);

// 🚀 Connect to MongoDB & Start Server
const PORT = process.env.PORT || 5000;

console.log('MONGO_URI:', process.env.MONGO_URI); // optional: for debugging only

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
