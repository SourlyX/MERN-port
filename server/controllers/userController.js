const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

// @desc    Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Por favor, completa todos los campos' });
    }

    const userExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (userExists || usernameExists) {
      return res.status(400).json({ success: false, message: 'El email o nombre de usuario ya está en uso' });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en registerUser:', error); // Log más descriptivo
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// @desc    Función para autenticar un usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Guardar refresh token en cookie HttpOnly
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    });

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken,
        incomes: user.incomes,
        expenses: user.expenses,
        todos: user.todos
      }
    });

  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// @desc    Renovar access token usando refresh token (cookie)
// @route   POST /api/users/refresh
// @access  Public
const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: 'No refresh token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(payload.id);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Refresh token inválido o expirado' });
  }
};

// Asegúrate que ambas funciones estén definidas ANTES de exportarlas.
module.exports = {
  registerUser,
  loginUser,
  refreshToken
};
