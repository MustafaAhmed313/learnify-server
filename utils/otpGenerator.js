const generateOtp = (min, max) => {
  const otp = Math.floor((Math.random() * (max - min)) + min);
  return otp;
} 

module.exports = generateOtp;