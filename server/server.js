require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express(); // <-- definir app primero

const PORT = process.env.PORT || 5001;

// Middleware para que Express entienda JSON
app.use(express.json());

// Middleware para cookies
app.use(cookieParser());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado exitosamente.'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
