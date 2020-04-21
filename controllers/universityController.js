const multer = require('multer');
const sharp = require('sharp');

const University = require('../models/university.model');

const factoryController = require('./factoryController');
const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// MIDDLEWARES
exports.uploadUniversityImage = upload.fields([{ name: 'image', maxCount: 1 }]);

exports.resizeUniversityImage = catchAsync(async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  if (!req.files.image) return next();

  // 1) Cover image
  req.body.image = `university-${Date.now()}-cover.jpeg`;

  await sharp(req.files.image[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toFile(`public/images/university/${req.body.image}`);
  next();
});

exports.getuniversity = factoryController.getOne(
  University,
  { path: 'proposals' },
  { path: 'members' }
);

exports.createUniversity = factoryController.createOne(University);
exports.getAlluniversities = factoryController.getAll(University);
