const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const poolRoutes = require('./routes/poolRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/pools', poolRoutes);
app.use('/api/transactions', transactionRoutes);

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// error handler
app.use(errorHandler);

module.exports = app;
