// app.js
const express = require('express');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes (keep original require paths) ---
const authRoutes = require('./routes/authRoutes');
const poolRoutes = require('./routes/poolRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const bidRoutes = require('./src/routes/bidding.routes');
const offerRoutes = require('./src/routes/offer_route'); // ensure exact filename
const userRoutes = require('./src/routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/pools', poolRoutes);
app.use('/api/transactions', transactionRoutes);

app.use('/bids', bidRoutes);
app.use('/offers', offerRoutes);
app.use('/users', userRoutes);

// --- Health-check ---
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --- Error handler (last middleware) ---
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
