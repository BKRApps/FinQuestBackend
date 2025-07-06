const express = require('express');
const cors = require('cors');
const { PrismaClient, Decimal } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Import auth routes
const authRoutes = require('./routes/auth');

// Middleware
app.use(cors());
app.use(express.json());

// Mount auth routes
app.use('/auth', authRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'FinQuest Backend API is running!' });
});

// Add Transaction endpoint
app.post('/transactions', async (req, res) => {
  try {
    const { amount, type, category, subcategory, comments, date, userId } = req.body;

    // Validate required fields
    if (!amount || !type || !category || !userId) {
      return res.status(400).json({
        error: 'Missing required fields: amount, type, category, and userId are required'
      });
    }

    // Validate amount is a number
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be a positive number'
      });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: new Decimal(amount),
        type,
        category,
        subcategory,
        comments,
        date: date ? new Date(date) : new Date(),
        userId: parseInt(userId)
      }
    });

    res.status(201).json({
      message: 'Transaction added successfully',
      transaction
    });

  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Get all transactions endpoint
app.get('/transactions', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        error: 'userId query parameter is required'
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json({
      transactions,
      count: transactions.length
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
  console.log(`Add transaction: POST http://localhost:${PORT}/transactions`);
  console.log(`Get transactions: GET http://localhost:${PORT}/transactions?userId=1`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
}); 