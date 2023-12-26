const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

require('./auth/passportAuth')(passport);

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/users', passport.authenticate('jwt', { session: false }), userRouter);
app.use('/auth', authRouter);

mongoose
  .connect(
    'mongodb+srv://' +
      process.env.LOGIN +
      ':' +
      process.env.PASSWORD +
      process.env.DATABASE,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.error('Error in connection:', err);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Our server is running on port ${process.env.PORT}`);
});
