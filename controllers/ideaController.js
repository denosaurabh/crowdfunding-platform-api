const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY__TEST);

const Idea = require('../models/idea.model');
const User = require('../models/user.model');

const factoryController = require('./factoryController');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.myIdeas = catchAsync(async (req, res, next) => {
  console.log(req.user._id);

  const myIdeas = await Idea.find({ uploadBy: req.user._id });

  res.status(200).json({
    status: 'success',
    data: {
      ideas: myIdeas
    }
  });
});

exports.ideaFunc = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Func Parameter
  const { func } = req.query;

  console.log(req.user._id);

  if (func === 'upvote') {
    console.log('Upvote');

    const isAlreadyUpvoted = await Idea.findOne({
      _id: id,
      upvotesBy: { $elemMatch: { $eq: req.user._id } }
    });

    console.log(isAlreadyUpvoted);

    // If The User has already Upvoted
    if (isAlreadyUpvoted) {
      return res.status(200).json({
        status: 'success',
        result: 'Already Upvoted'
      });
    }

    const data = await Idea.findByIdAndUpdate(id, {
      $inc: { upvotes: 1 },
      $push: { upvotesBy: req.user._id }
    });

    res.status(200).json({
      status: 'success',
      result: 'Upvoted',
      data: { data }
    });
  }
});

exports.postIdeaPaymentIntent = catchAsync(async (req, res, next) => {
  const { amount: amountStr } = req.query;

  // eslint-disable-next-line radix
  const amountNum = parseInt(amountStr);

  const idea = await Idea.findById(req.params.id).populate({
    path: 'uploadBy',
    select: '-password'
  });

  // 2) Create Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    payment_method_types: ['card'],
    amount: amountNum * 100,
    currency: 'usd',
    on_behalf_of: idea.uploadBy.accountId,
    transfer_data: {
      destination: idea.uploadBy.accountId
    }
  });

  /*
  
  transfer_data: {
      destination: idea.uploadBy.accountId
    }
  
  */

  // 3) Sending Paymrnt Intent as response
  res.status(200).json({
    status: 'success',
    data: paymentIntent
  });
});

// Webhook when Intent get Successful
exports.intentWebhook = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event = null;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_INTENT_WEBHOOK_SECRET
    );
  } catch (err) {
    // invalid signature
    res.status(400).end();
    return;
  }

  let intent = null;
  switch (event.type) {
    case 'payment_intent.succeeded':
      intent = event.data.object;
      console.log('Succeeded:', intent.id);
      break;
    case 'payment_intent.payment_failed':
      intent = event.data.object;
      // eslint-disable-next-line no-case-declarations
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.log('Failed:', intent.id, message);
      break;

    default:
      console.log('Default');
  }

  res.sendStatus(200);
});

exports.getAllIdeas = factoryController.getAll(Idea);
exports.getIdeaOne = factoryController.getOne(Idea, [
  {
    path: 'uploadBy',
    select: '-password -accountId'
  }
]);
exports.createIdea = factoryController.createOne(Idea);
