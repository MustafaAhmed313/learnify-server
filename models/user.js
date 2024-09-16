const mongoose = require('mongoose');
const { getErrorMessage, ERROR } = require('../utils/errorMessageHandler');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, getErrorMessage(ERROR.REQUIRED, 'Username')],
    unique: [true, getErrorMessage(ERROR.UNIQUE, 'Username')],
  },
  email: {
    type: String,
    required: [true, getErrorMessage(ERROR.REQUIRED, 'Email')],
    unique: [true, getErrorMessage(ERROR.UNIQUE, 'Email')],
  },
  password: {
    type: String,
    required: [true, getErrorMessage(ERROR.REQUIRED, 'Password')],
    min: [8, getErrorMessage(ERROR.SHORT_PASSWORD, 'Password')],
  },
  otp: {
    type: String,
    default: ''
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;