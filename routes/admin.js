const express = require('express');
const Admin = require('../models/Admin'); // Admin model
const User = require('../models/BankUser'); // User model with bank accounts
const router = express.Router();

// Admin login route (without password hashing)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' }); // Use real authentication for production
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all users with bank information
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username bankAccounts');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Admin route to search users by username or bank details
router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Search query required' });

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { 'bankAccounts.bankName': { $regex: query, $options: 'i' } },
        { 'bankAccounts.accountNumber': { $regex: query, $options: 'i' } },
        { 'bankAccounts.ifscCode': { $regex: query, $options: 'i' } }
      ]
    }, 'username bankAccounts');
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
});

module.exports = router;
