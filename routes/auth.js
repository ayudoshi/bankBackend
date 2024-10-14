const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/BankUser');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if(!user){
      const newUser = new User({ username, password });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    }else return res.status(400).json({message:"User already exist"});
    
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
