const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});