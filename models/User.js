const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  governorate: {
    type: String,
    required: false,
  },
  area: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: 'user', // 'admin' or 'user'
  },
  aiUsage: {
    count: { type: Number, default: 0 },
    lastUsed: { type: Date, default: null }
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);