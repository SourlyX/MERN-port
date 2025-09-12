const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/userController'); // Importamos la nueva función

// @desc    Registrar un nuevo usuario
// @route   POST /api/users/register
// @access  Public
router.post('/register', registerUser);

// @desc    Autenticar (buscar) un usuario
// @route   POST /api/users/login
// @access  Public
router.post('/login', loginUser); // Nueva ruta

module.exports = router;