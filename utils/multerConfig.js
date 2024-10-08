const multer = require('multer');

// diskStorage configuration.
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads');
  },
  filename: function(req, file, cb) {
      const ext = file.mimetype.split('/')[1];
      const fileName = `User-${Date.now()}.${ext}`;
      cb(null, fileName);
  }
});

// multerFilter configuration.
const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split('/')[0];  
  if(imageType === 'image') {
      return cb(null, true);
  } else {
      return cb(appError.create('File must be an image', 400), false);
  }
};

const upload = multer({ 
  storage: diskStorage,
  fileFilter
});

module.exports = {
  upload
};