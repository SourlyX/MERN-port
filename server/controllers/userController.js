const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Necesitamos bcrypt para comparar contraseñas

// ... (la función registerUser que ya creamos)

// @desc    Función para autenticar un usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verificar que llegaron los datos
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Por favor, completa todos los campos' });
    }

    // 2. Buscar al usuario por su email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' }); // Mensaje genérico por seguridad
    }

    // 3. Comparar la contraseña ingresada con la hasheada en la BD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // 4. ¡Éxito! Enviar todos los datos del usuario
    // (De nuevo, aquí generarías y enviarías un token JWT)
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        incomes: user.incomes,
        expenses: user.expenses,
        todos: user.todos
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

module.exports = {
  registerUser,
  loginUser // Exportamos la nueva función
};