const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! Only .pdf and .docx allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter
});

module.exports = upload.single('file');
