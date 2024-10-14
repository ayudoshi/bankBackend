require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const bankRoutes = require('./routes/bank');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
.then(() => { 
    console.log("connected to DB!")
})
.catch(err => { 
    console.error('App starting error:', err.stack);
    process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/admin', adminRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
