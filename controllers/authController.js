const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { STATUS, appError } = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');
const { getErrorMessage, ERROR } = require('../utils/errorMessageHandler');
const generateToken = require('../utils/jwtGenerator');


const signUp = asyncWrapper(async(req, res, next) => {
  const {
    username,
    email,
    password
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
  
  const oldUser = await User.findOne({ $or:[{email: email}, {username: username}] });
  if (oldUser) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.UNIQUE, 'Email or Username')
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
    password: hashedPassword
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
    username,
    password,
  } = req.body;

  if (!username || !password) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.MISSING_DATA)
    );
    res.status(400).json(error);
  }

  const oldUser = await User.findOne({username: username});
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

module.exports = {
  signUp,
  signIn,
};