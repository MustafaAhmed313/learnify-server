const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { STATUS, appError } = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');
const { getErrorMessage, ERROR } = require('../utils/errorMessageHandler');
const generateToken = require('../utils/jwtGenerator');
const sendEmail = require('../utils/email');
const { generateEmailTemplate, TEMPLATES } = require('../utils/generateEmailTemlate');
const generateOtp = require('../utils/otpGenerator');


const signUp = asyncWrapper(async(req, res, next) => {
  const {
    username,
    email,
    password,
    phone
  } = req.body;

  if (!username || !email || !password) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.MISSING_DATA)
    );
    res.status(400).json(error);
  }

  const result = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
  if (!result) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.INVALID, 'email')
    );
    res.status(400).json(error);
  }
  
  const oldUser = await User.findOne({email: email});
  if (oldUser) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.UNIQUE, 'Email')
    );
    res.status(400).json(error);
  }
  
  if (password.length < 8) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.SHORT_PASSWORD, 'Password')
    );
    res.status(400).json(error);
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = new User({
    username: username,
    email: email,
    password: hashedPassword,
    phone: phone
  });
  await user.save();

  const token = await generateToken({id: user._id}, process.env.EXPIRES_IN_SIGNUP);

  res.status(201).json({
    status: STATUS.SUCCESS,
    message: 'User created successfully!',
    data: { user },
    token: token
  });
});

const signIn = asyncWrapper(async(req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.MISSING_DATA)
    );
    res.status(400).json(error);
  }

  const oldUser = await User.findOne({email: email});
  if (!oldUser) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.NOT_FOUND, 'User')
    );
    res.status(404).json(error);
  }

  if (password.length < 8) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.SHORT_PASSWORD, 'Password')
    );
    res.status(400).json(error);
  }

  const match = await bcryptjs.compare(password, oldUser.password);
  if (!match) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.INVALID, 'Password')
    );
    res.status(400).json(error);
  }
  oldUser.password = undefined;

  const token = await generateToken({id: oldUser._id} , process.env.EXPIRES_IN_SIGNIN);

  res.status(200).json({
    status: STATUS.SUCCESS,
    message: 'User signed in successfully!',
    data: { oldUser },
    token: token
  });
});

const signOut = asyncWrapper(async(req, res, next) => {
  res.status(202).json({
    status: STATUS.SUCCESS,
    message: 'User signed out successfully!',
    token: ''
  });
});

const forgetPassword = asyncWrapper(async(req, res, next) => {
  const { email } = req.body;

  if (!email) {
    const error = appError(
      STATUS.FAIL,
      getErrorMessage(ERROR.REQUIRED, 'Email')
    );
    res.status(400).json(error);
  }

  const result = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
  if (!result) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.INVALID, 'email')
    );
    res.status(400).json(error);
  }

  const oldUser = await User.findOne({email: email});
  if (!oldUser) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.NOT_FOUND, 'User')
    );
    res.status(400).json(error);
  }

  const otp = generateOtp(1000, 9999);
  const hashedOtp = await bcryptjs.hash(otp.toString(), 10);
  oldUser.set('otp',hashedOtp);
  await oldUser.save();
  
  const message = generateEmailTemplate(TEMPLATES.FORGET_PASSWORD, {
    firstName: oldUser.username,
    data: otp 
  });
  
  try {
    await sendEmail({
      recipient: email,
      subject: `🔒 Forget Password Email 🔒`,
      message: message  
    });
  
    res.status(200).json({
      status: STATUS.SUCCESS,
      message: 'Email sent successfully!',
    });
  } catch (err) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage()
    )
  }
});

const validateOtp = asyncWrapper(async(req, res, next) => {
  const { 
    otp, 
    email 
  } = req.body;

  if (!otp || !email) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.MISSING_DATA)
    );
    res.status(400).json(error);
  }

  const oldUser = await User.findOne({email: email});
  if (!oldUser) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.NOT_FOUND, 'User')
    );
    res.status(400).json(error);
  }

  const match = await bcryptjs.compare(otp.toString(), oldUser.otp);
  
  if (!match) {
    res.status(400).json({
      status: STATUS.SUCCESS,
      message: getErrorMessage(ERROR.INVALID, 'otp'),
      valid: false
    });
  } else {
    oldUser.otp = ''
    res.status(200).json({
      status: STATUS.SUCCESS,
      message: 'OTP code verified successfully!',
      valid: true
    });
  }
});

// FIXME: Add resetToken and validate 

const resetPassword = asyncWrapper(async(req, res, next) => {
  const {
    email,
    password,
    confirmPassword,
  } = req.body;

  if (!email || !password || !confirmPassword) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.MISSING_DATA)
    );
    res.status(400).json(error);
  }

  const oldUser = await User.findOne({email: email});
  if (!oldUser) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.NOT_FOUND, 'User')
    );
    res.status(404).json(error);
  }

  if (password.length < 8 || confirmPassword < 8) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.SHORT_PASSWORD, 'Password')
    );
    res.status(400).json(error);
  }

  if (password !== confirmPassword) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.NO_MATCH_PASSWORD, 'Password')
    );
    res.status(400).json(error);
  }

  const match = await bcryptjs.compare(password, oldUser.password);
  if (match) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.SAME_PASSWORD, 'password')
    );
    res.status(400).json(error);
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  oldUser.password = hashedPassword;
  oldUser.save();

  res.status(201).json({
    status: STATUS.SUCCESS,
    message: 'User password changed successfully. Try to login!'
  });
});

const deleteAccount = asyncWrapper(async(req, res, next) => {
  const { email } = req.body

  if (!email) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.REQUIRED, 'Email')
    );
    res.status(400).json(error);
  }

  const oldUser = await User.findOne({email: email});
  if (!oldUser) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.NOT_FOUND, 'User')
    );
    res.status(404).json(error);
  }

  await User.findByIdAndDelete(oldUser._id);

  res.status(200).json({
    status: STATUS.SUCCESS,
    message: 'User account deleted successfully!'
  });
});

module.exports = {
  signUp,
  signIn,
  signOut,
  forgetPassword,
  validateOtp,
  resetPassword,
  deleteAccount
};