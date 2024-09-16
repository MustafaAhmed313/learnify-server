const express = require('express');
const {
  signUp,
  signIn,
  signOut,
  forgetPassword,
  validateOtp,
  resetPassword,
  deleteAccount
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup')
  .post(signUp);

router.route('/signin')
  .post(signIn);

router.route('/forget-pass')
  .post(forgetPassword);

router.route('/verify-otp')
  .post(validateOtp);

router.route('/reset-pass')
  .post(resetPassword);

router.route('/unsubscribe')
  .delete(deleteAccount);

router.route('/signout')
  .get(signOut);

module.exports = router;