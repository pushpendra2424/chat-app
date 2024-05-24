const path = require("path");
const multer = require("multer");
const { v4 } = require("uuid");

const maxSize = 1 * 1024 * 1024;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../temp");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + v4() + fileExtension);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpg", ".png", ".pdf"];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error("Only .jpg, .png, and .pdf files are allowed"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  //   limits: { fileSize: maxSize },
  fileFilter,
});

module.exports = upload;
