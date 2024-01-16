const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

dotenv.config();

require('./auth/passportAuth')(passport);

const app = express();

const allowedOrigins = ['http://localhost:8080'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

app.use('/users', passport.authenticate('jwt', { session: false }), userRouter);
app.use('/posts', passport.authenticate('jwt', { session: false }), postRouter);
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
