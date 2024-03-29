const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const https = require('https');
const socketInitializer = require('./sockets/socket');
const fs = require('fs');
const path = require('path');

dotenv.config();

require('./auth/passportAuth')(passport);

const app = express();

const allowedOrigins = [
  'http://localhost:8080',
  'https://localhost:8080',
  'https://localhost:3000',
  process.env.CALLBACK_URL,
];
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

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get(/^\/(?!api).*/, function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'client', 'dist', 'index.html'));
});

const privateKey = fs.readFileSync('../certs/example.com+5-key.pem', 'utf8');
const certificate = fs.readFileSync('../certs/example.com+5.pem', 'utf8');

const server = https.createServer(
  {
    key: privateKey,
    cert: certificate,
  },
  app
);

global.io = socketInitializer.initializeSocket(server);
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  userRouter
);
app.use(
  '/api/posts',
  passport.authenticate('jwt', { session: false }),
  postRouter
);
app.use('/api/auth', authRouter);

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

server.listen(port, () => {
  console.log(`Our server is running on port ${process.env.PORT}`);
});
