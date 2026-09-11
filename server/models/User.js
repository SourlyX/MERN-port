const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Esquema para el desglose que va DENTRO de un ingreso
const breakdownItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

// 1. Esquema para Ingresos y Gastos
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  breakDown: [breakdownItemSchema],
  isPendingPayday: {
    type: Boolean,
    default: false,
  },
  frequency: {
    type: String,
    enum: [
      "biweekly",
      "monthly",
      "quarterly",
      "fourmonthly",
      "semiannual",
      "annual",
      null,
    ],
    default: null,
  },
  appearsFrom: {
    type: Date,
    default: null,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  carriedOver: {
    type: Boolean,
    default: false,
  },
  instanceId: {
    type: String,
    default: null,
  },
  manuallyUnchecked: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    default: null,
  },
});

// 2. Esquema para las Tareas (Todos)
const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

// Una lista conserva sus tareas embebidas para que el orden de creación y el
// orden de las tareas se persistan tal como los ve el usuario.
const todoListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  todos: {
    type: [todoSchema],
    default: [],
  },
});

const payInfoSchema = new mongoose.Schema({
  payType: {
    type: String,
    enum: ["Monthly", "Biweekly", "Weekly"],
    default: "Biweekly",
  },
  paymentDates: {
    type: [Date],
    default: [],
  },
  grossSalary: {
    type: Number,
    default: 0,
  },
  taxes: {
    type: Number,
    default: 0,
  },
  vto: {
    type: Number,
    default: 0,
  },
  ot: {
    type: Number,
    default: 0,
  },
  isSalaried: {
    type: Boolean,
    default: false,
  },
  cutDays: {
    type: [Number],
    default: [1, 16],
  },
  workdayHours: {
    type: Number,
    default: 8,
    min: 1,
    max: 24,
  },
  payDays: {
    type: [Number],
    default: [15, 30],
  },
  moneyInHand: {
    type: Number,
    default: 0,
  },
  lastOpened: {
    type: Date,
    default: null,
  },
  lastPayDate: {
    type: Date,
    default: null,
  },
});

// 3. EL Esquema del USUARIO
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  incomes: [transactionSchema],
  expenses: [transactionSchema],
  todoLists: {
    type: [todoListSchema],
    default: [],
  },
  // Evita recrear una lista por defecto cuando un usuario que ya eliminó todas
  // sus listas vuelve a iniciar sesión.
  todoListsMigrationCompleted: {
    type: Boolean,
    default: false,
  },
  // Campo legado: se conserva temporalmente para migrar automáticamente las
  // tareas de usuarios ya existentes a su primera lista.
  todos: [todoSchema],
  payInfo: payInfoSchema,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
