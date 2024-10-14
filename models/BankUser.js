const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bankAccounts: [
    {
      bankName: { type: String },
      holderName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
    }
  ]
});

// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('BankUser', userSchema);
