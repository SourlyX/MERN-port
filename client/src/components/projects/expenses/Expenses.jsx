/**
 * Expenses.jsx
 * Componente principal para la gestión de ingresos y gastos del usuario.
 * Permite agregar, eliminar y guardar ingresos/gastos, así como configurar
 * datos salariales y períodos de pago. Los cambios se sincronizan con la
 * base de datos a través de la API de usuarios.
 */

import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { updateUserData } from "../../../api/users";
import IncomeFlow from "./IncomeFlow";
import Tables from "./Tables";
import styled from "styled-components";

/* ======================== Styled Components ======================== */

/** Contenedor principal con layout vertical centrado */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;

  & > * {
    width: 100%;
  }
`;

/** Contenedor horizontal para los inputs de ingresos y gastos */
const IncAndExpContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: auto;
`;

/** Botón estilizado para guardar cambios en la base de datos */
const SaveButton = styled.button`
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  width: auto;

  &:hover {
    background-color: #45a049;
  }
`;

/* ======================== Componente Principal ======================== */

const Expenses = () => {
  // Contexto de autenticación para acceder a datos del usuario
  const { user, isAuthenticated, updateUser } = useContext(AuthContext);

  /* -------------------- Opciones de selección -------------------- */

  /** Tipos de ingreso disponibles en el dropdown */
  const incomeOptions = [
    "Choose one type of income",
    "Dividend",
    "Sells",
    "Services",
    "Extra",
    "Other",
  ];

  /** Tipos de gasto disponibles en el dropdown */
  const expenseOptions = [
    "Choose one type of expense",
    "Dwelling",
    "Telephone Bill",
    "Internet Bill",
    "Water Bill",
    "Electrical Bill",
    "Feeding",
    "Transportation",
    "Health",
    "Education",
    "Debts",
    "Owed to people",
    "Leisure",
    "Clothing",
  ];

  /* -------------------- Valores por defecto -------------------- */

  /** Ingresos iniciales cuando no hay datos del usuario */
  const defaultIncome = [
    { type: "Net Salary", amount: 0 },
    { type: "Total", amount: 0 },
  ];

  /** Gastos iniciales cuando no hay datos del usuario */
  const defaultExpenses = [
    { type: "Dwelling", amount: 140000 },
    { type: "Telephone Bill", amount: 44000 },
    { type: "Internet Bill", amount: 29000 },
    { type: "Education", amount: 27000 },
    { type: "Total", amount: 240000 },
  ];

  /* -------------------- Estado del componente -------------------- */

  const [income, setIncome] = useState(defaultIncome);
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [dateRange, setDateRange] = useState([null, null]);
  const [salaryData, setSalaryData] = useState({
    grossSalary: "",
    taxes: 0,
    vto: "",
    ot: "",
    isSalaried: null,
    cutDays: [1, 16],
    workdayHours: 8, // Horas trabajadas en un día laboral (valor por defecto)
  });

  /* -------------------- Referencias -------------------- */

  /** Indica si ya se realizó la carga inicial de datos del usuario */
  const initialLoadDone = useRef(false);

  /** Almacena la clave del último período guardado para evitar guardados duplicados */
  const lastSavedPeriodStart = useRef(null);

  /* -------------------- Helpers -------------------- */

  /**
   * Construye el payload para enviar a la API.
   * Centraliza la estructura para evitar repetición.
   * @param {Object} overrides - Campos opcionales para sobreescribir valores de salaryData.
   * @returns {Object} Payload listo para enviar a la API.
   */
  const buildPayload = (overrides = {}) => ({
    incomes: income,
    expenses: expenses,
    payInfo: {
      ...salaryData,
      paymentDates: dateRange,
      ...overrides,
    },
  });

  /* -------------------- Efectos -------------------- */

  /**
   * Efecto de carga inicial: sincroniza el estado local con los datos
   * del usuario autenticado. Solo se ejecuta una vez.
   */
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (initialLoadDone.current) return;

    initialLoadDone.current = true;

    setIncome(
      user.incomes && user.incomes.length > 0 ? user.incomes : defaultIncome,
    );
    setExpenses(
      user.expenses && user.expenses.length > 0
        ? user.expenses
        : defaultExpenses,
    );

    if (user.payInfo?.paymentDates?.length === 2) {
      setDateRange([
        new Date(user.payInfo.paymentDates[0]),
        new Date(user.payInfo.paymentDates[1]),
      ]);
    }

    if (user.payInfo) {
      setSalaryData({
        grossSalary: user.payInfo.grossSalary || "",
        taxes: user.payInfo.taxes || 0,
        vto: user.payInfo.vto || "",
        ot: user.payInfo.ot || "",
        isSalaried: !!user.payInfo.isSalaried,
        cutDays: user.payInfo.cutDays || [1, 16],
        workdayHours: user.payInfo.workdayHours || 8,
      });
    }
  }, [isAuthenticated, user]);

  /**
   * Efecto de auto-guardado al cambiar los días de corte (cutDays).
   * Envía los datos actualizados a la API automáticamente.
   */
  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (!isAuthenticated || !dateRange[0] || !dateRange[1]) return;

    const autoSave = async () => {
      try {
        const payload = buildPayload();
        const updatedUser = await updateUserData(payload);
        updateUser(updatedUser);
        console.log("✅ CutDays auto-guardados");
      } catch (err) {
        console.error("Error al auto-guardar cutDays:", err);
      }
    };

    autoSave();
  }, [salaryData.cutDays[0], salaryData.cutDays[1]]);

  /**
   * Efecto de auto-guardado al cambiar el rango de fechas (período de pago).
   * Resetea VTO y OT a 0 cuando se detecta un nuevo período.
   */
  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (!isAuthenticated || !dateRange[0] || !dateRange[1]) return;

    const currentKey = `${dateRange[0].getFullYear()}-${dateRange[0].getMonth()}-${dateRange[0].getDate()}`;

    // Primera vez: solo almacena la clave sin guardar
    if (lastSavedPeriodStart.current === null) {
      lastSavedPeriodStart.current = currentKey;
      return;
    }

    // Si el período no cambió, no hacer nada
    if (currentKey === lastSavedPeriodStart.current) return;

    lastSavedPeriodStart.current = currentKey;

    // Resetear horas extras y VTO al cambiar de período
    setSalaryData((prev) => ({ ...prev, vto: 0, ot: 0 }));

    const autoSave = async () => {
      try {
        const payload = buildPayload({ vto: 0, ot: 0 });
        const updatedUser = await updateUserData(payload);
        updateUser(updatedUser);
        console.log("✅ Periodo auto-guardado (VTO/OT reseteados)");
      } catch (err) {
        console.error("Error al auto-guardar periodo:", err);
      }
    };

    autoSave();
  }, [dateRange]);

  /* -------------------- Handlers -------------------- */

  /**
   * Guarda manualmente todos los cambios en la base de datos.
   * Valida que exista un período de pago si el usuario es asalariado.
   */
  const saveChanges = async () => {
    try {
      if (salaryData.isSalaried) {
        if (!dateRange[0] || !dateRange[1]) {
          alert("Please select a payroll period before saving.");
          return;
        }
      }

      const payload = buildPayload();
      const updatedUser = await updateUserData(payload);
      updateUser(updatedUser);
      alert("Changes saved!");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  /* -------------------- Estado para nuevos registros -------------------- */

  const [newIncome, setNewIncome] = useState();
  const [incomeType, setIncomeType] = useState(incomeOptions[0]);
  const [newExpense, setNewExpense] = useState();
  const [expenseType, setExpenseType] = useState(expenseOptions[0]);

  /**
   * Agrega un nuevo ingreso a la lista, validando que se haya
   * ingresado un monto y seleccionado un tipo. Recalcula el total.
   */
  const addIncome = () => {
    if (!newIncome) {
      alert("Please input an income");
      return;
    }
    if (incomeType === incomeOptions[0]) {
      alert("Please select a type of income");
      return;
    }

    const newIncomeObject = {
      type: incomeType,
      amount: parseFloat(newIncome),
    };

    const currentIncomes = income.slice(0, -1);
    const oldTotal = income.at(-1);
    const updatedIncomes = [...currentIncomes, newIncomeObject];
    const newTotal = {
      type: "Total",
      amount: oldTotal.amount + newIncomeObject.amount,
    };

    setIncome([...updatedIncomes, newTotal]);
    setNewIncome("");
  };

  /**
   * Agrega un nuevo gasto a la lista, validando que se haya
   * ingresado un monto y seleccionado un tipo. Recalcula el total.
   */
  const addExpense = () => {
    if (!newExpense) {
      alert("Please input an expense");
      return;
    }
    if (expenseType === expenseOptions[0]) {
      alert("Please select a type of expense");
      return;
    }

    const newExpenseObject = {
      type: expenseType,
      amount: parseFloat(newExpense),
    };

    const currentExpenses = expenses.slice(0, -1);
    const oldTotal = expenses.at(-1);
    const updatedExpenses = [...currentExpenses, newExpenseObject];
    const newTotal = {
      type: "Total",
      amount: oldTotal.amount + newExpenseObject.amount,
    };

    setExpenses([...updatedExpenses, newTotal]);
    setNewExpense("");
  };

  /**
   * Elimina un elemento (ingreso o gasto) de la lista correspondiente
   * y recalcula el total automáticamente.
   * @param {Array} typeFromDelete - Lista de origen (income o expenses)
   * @param {Object} target - Elemento a eliminar
   */
  const handleDelete = (typeFromDelete, target) => {
    const updatedType = typeFromDelete.filter((type) => {
      return type !== target;
    });

    const currentType = updatedType.slice(0, -1);
    const newTotalAmount = currentType.reduce((sum, item) => {
      return sum + Number(item.amount);
    }, 0);

    const newTotalObject = {
      type: "Total",
      amount: newTotalAmount,
    };

    if (typeFromDelete === income) {
      setIncome([...currentType, newTotalObject]);
    } else if (typeFromDelete === expenses) {
      setExpenses([...currentType, newTotalObject]);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <Container>
      {/* Sección de entrada para nuevos ingresos */}
      <IncAndExpContainer>
        <select
          value={incomeType}
          style={{
            height: "35px",
            width: "150px",
            borderRadius: "10px",
            maxWidth: "90%",
          }}
          onChange={(e) => setIncomeType(e.target.value)}
        >
          {incomeOptions.map((income) => (
            <option key={income}>{income}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Income amount"
          style={{ height: "35px", borderRadius: "10px", maxWidth: "90%" }}
          value={newIncome}
          onChange={(e) => setNewIncome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addIncome(newIncome)}
        />
      </IncAndExpContainer>

      {/* Sección de entrada para nuevos gastos */}
      <IncAndExpContainer>
        <select
          value={expenseType}
          style={{
            height: "35px",
            width: "150px",
            borderRadius: "10px",
            maxWidth: "90%",
          }}
          onChange={(e) => setExpenseType(e.target.value)}
        >
          {expenseOptions.map((expense) => (
            <option key={expense}>{expense}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Expense amount"
          style={{ height: "35px", borderRadius: "10px", maxWidth: "90%" }}
          value={newExpense}
          onChange={(e) => setNewExpense(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addExpense(newExpense)}
        />
      </IncAndExpContainer>

      {/* Componente de flujo de ingresos y configuración salarial */}
      <IncomeFlow
        income={income}
        setIncome={setIncome}
        dateRange={dateRange}
        setDateRange={setDateRange}
        salaryData={salaryData}
        setSalaryData={setSalaryData}
      />

      {/* Tablas de ingresos y gastos con opción de eliminación */}
      <Tables income={income} expenses={expenses} handleDelete={handleDelete} />

      {/* Botón para guardar cambios manualmente */}
      <SaveButton onClick={saveChanges}>Save changes on Database</SaveButton>
    </Container>
  );
};

export default Expenses;