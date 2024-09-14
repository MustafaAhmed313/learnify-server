const express = require('express');
const {
  signUp,
  signIn,
  signOut,
  forgetPassword
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup')
  .post(signUp);

router.route('/signin')
  .post(signIn);

router.route('/forgetpass')
  .post(forgetPassword);

router.route('/signout')
  .get(signOut);

module.exports = router;