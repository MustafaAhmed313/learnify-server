const express = require('express');
const {
  signUp,
  signIn
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup')
  .post(signUp);

  router.route('/signin')
  .post(signIn);

module.exports = router;