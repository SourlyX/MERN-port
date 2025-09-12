const express = require('express');
const connectDB = require('./config/db')
require('dotenv').config();
const UserRoutes = require('./routes/users');

const app = express();

app.arguments(express.json());

const PORT = process.env.PORT || 5001;

app.arguments('/api/users', UserRoutes);

connectDB();

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});
