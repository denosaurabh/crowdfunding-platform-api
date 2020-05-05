const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY__TEST);
const iso3311a2 = require('iso-3166-1-alpha-2');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user.model');
const catchasync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
  req.body.imageCover = `user-${req.user._id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.avatar[0].buffer)
    .resize(150, 150)
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
    'imageCover',
    'job',
    'country'
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    message: 'User has updated successfully!',
    data: {
      user: updatedUser
    }
  });
});

exports.getMe = catchasync(async (req, res, next) => {
  const me = await User.findById(req.user._id).select('-password -accountId');

  res.status(200).json({
    status: 'success',
    data: {
      me
    }
  });
});

exports.checkStripeAccount = catchasync(async (req, res, next) => {
  if (!req.user.accountId) {
    return next(
      new AppError('You have no Business Account! Create a one!', 400)
    );
  }

  const link = await stripe.accounts.createLoginLink(req.user.accountId);

  res.status(200).json({
    status: 'success',
    data: {
      link: link.url
    }
  });
});

exports.stripeAccountVerification = catchasync(async (req, res, next) => {
  const authCode = req.query.code;
  console.log(authCode);

  const response = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code: authCode
  });
  console.log(response);

  const connectedAccountId = response.stripe_user_id;

  await User.findByIdAndUpdate(req.user._id, {
    accountId: connectedAccountId,
    accountVerified: true
  });

  // const userId = req.user._id;

  // // Making Stripe Connected Account
  // const account = await stripe.accounts.create({
  //   country: iso3311a2.getCode(req.user.country),
  //   type: 'custom',
  //   requested_capabilities: ['card_payments', 'transfers']
  // });

  // const accountId = account.id;

  // await User.findByIdAndUpdate(userId, {
  //   accountId
  // });

  // const accountLink = await stripe.accountLinks.create({
  //   account: accountId,
  //   failure_url: `${req.protocol}://${req.get(
  //     'host'
  //   )}/v1/api/user/verify/failed`,
  //   success_url: `${req.protocol}://${req.get(
  //     'host'
  //   )}/v1/api/user/verify/success`,
  //   type: 'custom_account_verification',
  //   collect: 'eventually_due'
  // });

  res.status(200).json({
    status: 'success',
    message: 'Your Account has been verified Successfully!'
  });
});

// Testing Purposes
exports.accountVerifySuccess = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'You account has Verified successfully!'
  });
};

exports.accountVerifyFailed = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'You account has not Verified!'
  });
};
