const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Підключення до MongoDB
mongoose.connect('mongodb+srv://lobodadariask:mwUJAyYtGUHU7zHD@cluster0.ptb6z68.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// API статус
app.get('/', (req, res) => {
    res.json('API start!');
});

// Реєструємо маршрути
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/tests', testRoutes);

// Vercel API handler
module.exports = app;
