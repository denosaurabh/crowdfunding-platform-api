const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY__TEST);

const Idea = require('../models/idea.model');
const Fund = require('../models/fund.model');

const factoryController = require('./factoryController');
const catchAsync = require('../utils/catchAsync');

exports.myIdeas = catchAsync(async (req, res, next) => {
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

  if (func === 'upvote') {
    const isAlreadyUpvoted = await Idea.findOne({
      _id: id,
      upvotesBy: { $elemMatch: { $eq: req.user._id } }
    });

    // If The User has already Upvoted
    if (isAlreadyUpvoted) {
      return res.status(200).json({
        status: 'success',
        message: 'Already Upvoted',
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
    amount: amountNum,
    currency: 'usd',
    on_behalf_of: idea.uploadBy.accountId,
    transfer_data: {
      destination: idea.uploadBy.accountId
    },
    metadata: {
      sender_name: req.user.name,
      sender_email: req.user.email,
      sender_img: req.user.imageCover,
      sender_job: req.user.job,
      ideaId: req.params.id
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

  if (event.type === 'payment_intent.succeeded') {
    intent = event.data.object;
    await Idea.findByIdAndUpdate(intent.metadata.ideaId, {
      $inc: { currentFunded: intent.amount }
    });

    await Fund.create({
      amount: intent.amount,
      name: intent.metadata.sender_name,
      job: intent.metadata.sender_job,
      email: intent.metadata.sender_email,
      img: intent.metadata.sender_img,
      ideaId: intent.metadata.ideaId
    });

    // await Idea.fns
  } else if (event.type === 'payment_intent.payment_failed') {
    intent = event.data.object;
    const message =
      intent.last_payment_error && intent.last_payment_error.message;

    // eslint-disable-next-line no-console
    console.log('Failed:', intent.id, message);
  }

  res.sendStatus(201);
});

exports.getAllIdeas = factoryController.getAll(Idea);
exports.getIdeaOne = factoryController.getOne(Idea, [
  {
    path: 'uploadBy',
    select: '-password -accountId'
  }
]);
exports.createIdea = factoryController.createOne(Idea);
