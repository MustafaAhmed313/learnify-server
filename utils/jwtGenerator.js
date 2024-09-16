const jwt = require('jsonwebtoken');

const generateToken = async(payload, expiresIn) => {
  const token = await jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: expiresIn
  });
  return token;
};

module.exports = generateToken;