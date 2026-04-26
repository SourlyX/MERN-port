const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/protect')
const { registerUser, loginUser, refreshToken, updateUserData, getUserData } = require('../controllers/userController'); 

// @desc    Registrar un nuevo usuario
// @route   POST /api/users/register
// @access  Public
router.post('/register', registerUser);

// @desc    Autenticar un usuario
// @route   POST /api/users/login
// @access  Public
router.post('/login', loginUser);

// @desc    Renovar access token usando refresh token
// @route   POST /api/users/refresh
// @access  Public
router.post('/refresh', refreshToken);

// @desc    Actualizar incomes, expenses y payInfo de usuario loggeado
// @route   PUT /api/users/update
// @access  Private
router.put('/update', protect, updateUserData);

// @desc    Obtener data del usuario loggeado
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, getUserData);

module.exports = router;