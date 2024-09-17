const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const authRouter = require('./routes/authRoutes');

const app = express();

app.use(morgan(process.env.NODE_ENV));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use('/api/auth', authRouter);

app.get('/' , (req, res) => {
  res.status(200).send('Testing Connection...');
}); 

module.exports = {
  app
};