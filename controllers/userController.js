const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user.model');
const factoryHandlers = require('./factoryController');
const catchasync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

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
exports.uploadUserImages = upload.fields([{ name: 'avatar', maxCount: 1 }]);

exports.resizeUserImages = catchasync(async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  if (!req.files.avatar) return next();

  // 1) Cover image
  req.body.avatar = `user-${req.user._id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/users/${req.body.imageCover}`);
  next();
});

// Filter some fields for Update , FUNCTIONS
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// QUERIES
exports.updateMe = catchasync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError(
        'Password here is not allowed to Update, use /forgotpassword for that',
        400
      )
    );
  }

  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'about',
    'avatar',
    'job',
    'country'
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.getMe = catchasync(async (req, res, next) => {
  const me = await User.findById(req.user._id).select('-password');

  res.status(200).json({
    status: 'success',
    data: {
      me
    }
  });
});
