require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://sourly.dev',
  'http://45.79.223.135'
];

// Configuración CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const PORT = process.env.PORT || 5001;

// Middleware para que Express entienda JSON
app.use(express.json());

// Middleware para cookies
app.use(cookieParser());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado exitosamente.'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas API
const { router: userRoutes } = require('./routes/users');
app.use('/api/users', userRoutes);

// Servir React en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});