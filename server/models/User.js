const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Esquema para el desglose que va DENTRO de un ingreso
const breakdownItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

// 1. Esquema para Ingresos y Gastos
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  breakDown: [breakdownItemSchema] 
});

// 2. Esquema para las Tareas (Todos)
const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  }
});

// 3. EL Esquema del USUARIO
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  incomes: [transactionSchema],
  expenses: [transactionSchema],
  todos: [todoSchema]
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);