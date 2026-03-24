const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

// @desc    Registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill out all the spaces' });
    }

    const userExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (userExists || usernameExists) {
      return res.status(400).json({ success: false, message: 'The email or username is already in use' });
    }

    const user = new User({
      username,
      email,
      password,
      incomes: [
        {
          type: "Net Salary",
          amount: 0,
          breakDown: []
        },
        {
          type: "Total",
          amount: 0,
        }
      ],
      expenses: [
        {
          type: "Total",
          amount: 0,
        }
      ],
      todos: [],
      payInfo: {
        payType: 'Biweekly',
        paymentDates: []
      }
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Autenticar un usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
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
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Renovar access token usando refresh token
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
    return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// @desc    Actualizar datos del usuario
const updateUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const { incomes, expenses, payInfo } = req.body;

    if (Array.isArray(incomes)) user.incomes = incomes;
    if (Array.isArray(expenses)) user.expenses = expenses;
    if (payInfo) user.payInfo = payInfo;

    const updatedUserDoc = await user.save();

    const { password, __v, ...safeUser } = updatedUserDoc.toObject();
    return res.json({
      success: true,
      message: 'Usuario actualizado',
      data: safeUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  updateUserData
};