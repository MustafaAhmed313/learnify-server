const ERROR = {
  REQUIRED: 'required', 
  UNIQUE: 'unique',
  SHORT_PASSWORD: 'short_password',
  MISSING_DATA: 'missing',
  INVALID: 'invalid',
  NOT_FOUND: 'not-found'
}

const getErrorMessage = (errorType, field) => {
  let errorMessage;

  switch(errorType) {
    case ERROR.REQUIRED : 
      errorMessage = `${field} is required!`;
      break;
    case ERROR.UNIQUE : 
      errorMessage = `${field} already exist!`;
      break;
    case ERROR.SHORT_PASSWORD : 
      errorMessage = `${field} should be at least 8 characters!`;
      break;
    case ERROR.MISSING_DATA : 
      errorMessage = `There are missing fields!`;
      break;
    case ERROR.INVALID : 
      errorMessage = `Invalid ${field}!`;
      break;
    case ERROR.NOT_FOUND : 
      errorMessage = `${field} not found!`;
      break;
  }

  return errorMessage;
} 

module.exports = {
  ERROR,
  getErrorMessage
}