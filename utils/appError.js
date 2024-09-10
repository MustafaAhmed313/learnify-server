const STATUS = {
  SUCCESS: 'success',
  FAIL: 'fail'
};

class AppError {
  create(status, message, data) {
    return {
      status: status,
      message: message,
      data: data
    };
  }
};

const appError = new AppError();

module.exports = {
  appError,
  STATUS
}
