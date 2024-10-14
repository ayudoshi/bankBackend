const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/BankUser');
const router = express.Router();

// Middleware for token verification
const verifyToken = (req, res, next) => {
  const token= req.headers['authorization'];
  //testing with postman use this to get the token
  // const token=tokenData.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    next();
  });
};

// Add Bank Account
router.post('/add', verifyToken, async (req, res) => {
  const { bankName, holderName, accountNumber, ifscCode } = req.body;
  try {
    const user = await User.findById(req.userId);
    const existingAccount = user.bankAccounts.find(account => account.accountNumber === accountNumber);
    
    if (existingAccount) {
      return res.status(400).json({ message: 'Bank account already added' });
    }
    
    user.bankAccounts.push({ bankName, holderName, accountNumber, ifscCode });
    await user.save();
    res.status(200).json(user.bankAccounts);
  } catch (error) {
    res.status(500).json({ message: 'Error adding bank account' });
  }
});

// Get Bank Accounts
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json(user.bankAccounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bank accounts' });
  }
});

// Edit Bank Account
router.put('/edit/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const account = user.bankAccounts.id(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });

    account.bankName = req.body.bankName || account.bankName;
    account.holderName = req.body.holderName || account.holderName;
    account.accountNumber = req.body.accountNumber || account.accountNumber;
    account.ifscCode = req.body.ifscCode || account.ifscCode;

    await user.save();
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Error updating bank account' });
  }
});

// Delete Bank Account
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);    
    user.bankAccounts.id(req.params.id).deleteOne();
    await user.save();
    res.status(200).json({ message: 'Bank account removed' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error deleting bank account' });
  }
});

module.exports = router;
