const express = require('express');
const { 
  changeAvatar
} = require('../controllers/userController');
const { upload } = require('../utils/multerConfig');

const router = express.Router();

router.route('/change-avatar')
  .post(upload.single('avatar'), changeAvatar);

module.exports = router;