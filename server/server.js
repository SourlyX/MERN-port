const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware para que Express entienda JSON
// CORRECCIÓN: Es app.use(), no app.arguments()
app.use(express.json());

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
