const express = require('express');
const {
  signUp,
  signIn,
  signOut,
  forgetPassword,
  validateOtp
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup')
  .post(signUp);

router.route('/signin')
  .post(signIn);

router.route('/forgetpass')
  .post(forgetPassword);

router.route('/verifyOtp')
  .post(validateOtp);

router.route('/signout')
  .get(signOut);

module.exports = router;