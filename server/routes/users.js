const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/protect')
const { updateUserData } = require('../controllers/userController')

const { registerUser, loginUser, refreshToken } = require('../controllers/userController'); 

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

// @desc    Actualizar incomes y expenses de usuario loggeado
// @route   PUT /api/users/update
// @access  Private
router.put('/update', protect, updateUserData)

module.exports = router;
