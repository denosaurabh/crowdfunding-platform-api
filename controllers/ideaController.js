const stripe = require('stripe');

const Idea = require('../models/idea.model');
const User = require('../models/user.model');

const factoryController = require('./factoryController');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getFundCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const idea = await Idea.findById(req.params.id);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/idea/${req.params.id}`,
    cancel_url: `${req.protocol}://${req.get('host')}/idea/${req.params.id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    line_items: [
      {
        name: `${idea.name} Tour`,
        description: idea.description,
        amount: req.query.amount,
        currency: 'usd'
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

const createBookingCheckout = async session => {
  const idea = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount;

  await idea.findByIdAndUpdate(idea, {
    $inc: { currentFunded: price }
  });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

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

exports.getAllIdeas = factoryController.getAll(Idea);
exports.getIdeaOne = factoryController.getOne(Idea);
exports.createIdea = factoryController.createOne(Idea);
