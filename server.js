const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 😈 Shutting down the server Gracefully....');
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB has connected successfully :D'));

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`App is listening for requests on port ${port} ....`);
});

process.on('unhandledRejection', err => {
  console.log(
    'UNHANDLED REJECTION! 😡 Shutting down the server Gracefully ...'
  );
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM Signal RECEIVED. Shutting down server gracefully 😄');
  server.close(() => {
    console.log('All Process has terminated ✅✅!');
  });
});
