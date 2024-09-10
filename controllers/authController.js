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
    res.status(401).json(error);
  }

  const result = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
  if (!result) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.INVALID, 'email')
    );
    res.status(401).json(error);
  }
  
  const oldUser = await User.findOne({email: email});
  if (oldUser) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.UNIQUE, 'Email')
    );
    res.status(401).json(error);
  }
  
  if (password.length < 8) {
    const error = appError.create(
      STATUS.FAIL,
      getErrorMessage(ERROR.SHORT_PASSWORD, 'Password')
    );
    res.status(401).json(error);
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

module.exports = {
  signUp
};