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
  margin-top: 20px;
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

/** Contenedor específico para los inputs de gastos, con animación para el campo "available from" */
const ExpenseInputContainer = styled(IncAndExpContainer)`
  min-height: 70px;
  align-items: center;
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

/** Input estilizado para los campos de tipo y monto */
const Input = styled.input`
  height: 35px;
  border-radius: 10px;
  max-width: 90%;
  border: 1px solid #4fffff;
`;

const AvailableFromWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  animation: ${({ $leaving }) => ($leaving ? "slideOut" : "slideIn")} 300ms ease
    forwards;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px) translateY(-6px);
      max-width: 0;
    }
    to {
      opacity: 1;
      transform: translateX(0) translateY(0);
      max-width: 120px;
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0) translateY(0);
      max-width: 120px;
    }
    to {
      opacity: 0;
      transform: translateX(-20px) translateY(-6px);
      max-width: 0;
    }
  }
`;

/* ======================== Componente Principal ======================== */

const PersonalFinance = () => {
  // Contexto de autenticación para acceder a datos del usuario
  const { user, isAuthenticated, updateUser } = useContext(AuthContext);

  /** Ingresos iniciales cuando no hay datos del usuario */
  const defaultIncome = [
    { type: "Net Salary", amount: 0 },
    { type: "Total", amount: 0 },
  ];

  /** Gastos iniciales cuando no hay datos del usuario */
  const defaultExpenses = [
    { type: "Dwelling", amount: 140000, isRecurring: true, paid: false },
    { type: "Telephone Bill", amount: 44000, isRecurring: true, paid: false },
    { type: "Internet Bill", amount: 29000, isRecurring: true, paid: false },
    { type: "Total", amount: 213000 },
  ];

  /* -------------------- Estado del componente -------------------- */

  const [income, setIncome] = useState(defaultIncome);
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [expenseIsRecurring, setExpenseIsRecurring] = useState(true);
  const [availableFrom, setAvailableFrom] = useState(1);
  const [showAvailable, setShowAvailable] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [salaryData, setSalaryData] = useState({
    grossSalary: "",
    taxes: 0,
    vto: "",
    ot: "",
    isSalaried: null,
    cutDays: [1, 16],
    payDays: [15, 30],
    moneyInHand: 0,
    workdayHours: 8,
    lastOpened: null,
    lastPayDate: null,
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
        ? user.expenses.map((e) =>
            e.type === "Total"
              ? e
              : {
                  ...e,
                  isRecurring: e.isRecurring ?? false,
                  paid: e.paid ?? false,
                },
          )
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
        payDays: user.payInfo.payDays || [15, 30],
        moneyInHand: user.payInfo.moneyInHand || 0,
        workdayHours: user.payInfo.workdayHours || 8,
        lastOpened: user.payInfo.lastOpened || null,
        lastPayDate: user.payInfo.lastPayDate || null,
      });
    }
    checkPeriodChange(user);
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

  const [newIncome, setNewIncome] = useState(0);
  const [incomeType, setIncomeType] = useState("");
  const [newExpense, setNewExpense] = useState(0);
  const [expenseType, setExpenseType] = useState("");

  /* -------------------- Funciones de lógica financiera -------------------- */
  /**
   * Verifica si el usuario ha cambiado de período de pago desde la última vez
   * que abrió la aplicación. Si es así, actualiza los ingresos/gastos y fechas
   * de pago según corresponda, considerando los días de corte y payday configurados.
   * Este proceso se ejecuta al cargar la aplicación para mantener los datos sincronizados.
   * @param {Object} user - Objeto del usuario autenticado con su información financiera.
   */
  const checkPeriodChange = async (user) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Primera apertura
    if (!user.payInfo?.lastOpened) {
      await updateUserData({
        incomes: user.incomes,
        expenses: user.expenses,
        payInfo: {
          ...user.payInfo,
          lastOpened: today.toISOString(),
        },
      })
        .then((updatedUser) => {
          updateUser(updatedUser);
          setSalaryData((prev) => ({
            ...prev,
            lastOpened: today.toISOString(),
          }));
        })
        .catch(console.error);
      return;
    }

    const rawCutDays = user.payInfo.cutDays || [1, 16];

    // 2. Sin baseline — buscar payday más reciente antes de hoy
    if (!user.payInfo?.lastPayDate) {
      const rawPayDays = user.payInfo.payDays || [15, 30];

      const pastPayDays = rawPayDays
        .map((d) => {
          const date = new Date(today.getFullYear(), today.getMonth(), d);
          date.setHours(0, 0, 0, 0);
          return date;
        })
        .filter((d) => d <= today)
        .sort((a, b) => b - a);

      const baseline =
        pastPayDays[0] || new Date(today.getFullYear(), today.getMonth(), 1);

      await updateUserData({
        incomes: user.incomes,
        expenses: user.expenses,
        payInfo: {
          ...user.payInfo,
          lastPayDate: baseline.toISOString(),
          lastOpened: today.toISOString(),
        },
      })
        .then((updatedUser) => {
          updateUser(updatedUser);
          setSalaryData((prev) => ({
            ...prev,
            lastPayDate: baseline.toISOString(),
            lastOpened: today.toISOString(),
          }));
        })
        .catch(console.error);
      return;
    }

    // 3. Calcular cutDays perdidos desde lastPayDate hasta hoy
    const startDate = new Date(user.payInfo.lastPayDate);
    startDate.setHours(0, 0, 0, 0);

    const getCutDates = (from, to) => {
      const dates = [];
      let year = from.getFullYear();
      let month = from.getMonth();

      while (new Date(year, month, 1) <= to) {
        const lastDay = new Date(year, month + 1, 0).getDate();
        const uniqueDays = [
          ...new Set(rawCutDays.map((d) => Math.min(d, lastDay))),
        ];

        for (const day of uniqueDays) {
          const cutDate = new Date(year, month, day);
          cutDate.setHours(0, 0, 0, 0);
          if (cutDate > from && cutDate <= to) {
            dates.push(cutDate);
          }
        }

        month++;
        if (month > 11) {
          month = 0;
          year++;
        }
      }

      return dates;
    };

    const missedCutDates = getCutDates(startDate, today);
    const count = missedCutDates.length;

    // 4. Nada que hacer
    if (count === 0) return;

    const lastCutDate = missedCutDates[missedCutDates.length - 1];

    const totalExpenses = user.expenses?.at(-1)?.amount || 0;
    const totalIncome =
      user.incomes?.filter((i) => !i.isPendingPayday).at(-1)?.amount || 0;
    const realBalance =
      (user.payInfo.moneyInHand || 0) + (totalIncome - totalExpenses);

    // 5. Un período
    if (count === 1) {
      const baseIncomes = user.incomes?.slice(0, -1) || [];

      const hasExistingPending = baseIncomes.some((i) => i.isPendingPayday);

      const promotedIncomes = hasExistingPending
        ? baseIncomes.map((i) =>
            i.isPendingPayday ? { ...i, isPendingPayday: false } : i,
          )
        : baseIncomes;

      const promotedTotal = promotedIncomes.reduce(
        (sum, i) => sum + i.amount,
        0,
      );

      const netSalary =
        user.incomes?.find((i) => i.type === "Net Salary")?.amount || 0;

      const updatedIncome =
        netSalary > 0
          ? [
              ...promotedIncomes,
              {
                type: "Pending payday",
                amount: netSalary,
                isPendingPayday: true,
              },
              { type: "Total", amount: promotedTotal },
            ]
          : [...promotedIncomes, { type: "Total", amount: promotedTotal }];

      await updateUserData({
        incomes: updatedIncome,
        expenses: user.expenses,
        payInfo: {
          ...user.payInfo,
          vto: "",
          ot: "",
          moneyInHand: realBalance,
          lastPayDate: lastCutDate.toISOString(),
          lastOpened: today.toISOString(),
        },
      })
        .then((updatedUser) => {
          updateUser(updatedUser);
          setIncome(updatedIncome);
          setSalaryData((prev) => ({
            ...prev,
            vto: "",
            ot: "",
            moneyInHand: realBalance,
            lastPayDate: lastCutDate.toISOString(),
            lastOpened: today.toISOString(),
          }));
        })
        .catch(console.error);

      // 6. Múltiples períodos
    } else {
      const baseExpenses = user.expenses?.slice(0, -1) || [];

      const nextExpenses = baseExpenses
        .filter((e) => e.isRecurring)
        .map((e) => ({
          ...e,
          paid: false,
          carriedOver: e.isRecurring && !e.paid ? true : false,
        }));

      const nextTotal = {
        type: "Total",
        amount: nextExpenses.reduce((sum, e) => sum + e.amount, 0),
      };

      const finalExpenses = [...nextExpenses, nextTotal];

      await updateUserData({
        incomes: defaultIncome,
        expenses: finalExpenses,
        payInfo: {
          ...user.payInfo,
          vto: "",
          ot: "",
          moneyInHand: realBalance,
          lastPayDate: lastCutDate.toISOString(),
          lastOpened: today.toISOString(),
        },
      })
        .then((updatedUser) => {
          updateUser(updatedUser);
          setIncome(defaultIncome);
          setExpenses(finalExpenses);
          setSalaryData((prev) => ({
            ...prev,
            vto: "",
            ot: "",
            moneyInHand: realBalance,
            lastPayDate: lastCutDate.toISOString(),
            lastOpened: today.toISOString(),
          }));
        })
        .catch(console.error);
    }
  };

  /**
   * Agrega un nuevo ingreso a la lista, validando que se haya
   * ingresado un monto y seleccionado un tipo. Recalcula el total.
   */
  const addIncome = () => {
    if (!newIncome) {
      alert("Please input an income");
      return;
    }
    if (!incomeType) {
      alert("Please input an income type");
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
    setIncomeType("");
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
    if (!expenseType) {
      alert("Please input an expense type");
      return;
    }

    const newExpenseObject = {
      type: expenseType,
      amount: parseFloat(newExpense),
      isRecurring: expenseIsRecurring,
      paid: false,
      ...(expenseIsRecurring && { availableFrom }),
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
    setExpenseType("");
  };

  /**
   * Actualiza el dinero disponible en mano/banco dentro de salaryData
   * sin pisar el resto de los campos del estado.
   * @param {number} value - Nuevo monto de dinero en mano
   */
  const setMoneyInHand = (value) =>
    setSalaryData((prev) => ({ ...prev, moneyInHand: value }));

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

  /**
   * Edita un elemento (ingreso o gasto) de la lista correspondiente
   * y recalcula el total automáticamente.
   * @param {Array} typeFromEdit - Lista de origen (income o expenses)
   * @param {Object} target - Elemento a editar
   * @param {string} newType - Nuevo nombre/tipo del elemento
   * @param {number} newAmount - Nuevo monto del elemento
   */
  const handleEdit = (typeArray, target, newType, newAmount) => {
    const updatedType = typeArray.map((type) => {
      if (type.type === target) {
        return { ...target, type: newType, amount: parseFloat(newAmount) };
      }
      return type;
    });

    const currentType = updatedType.slice(0, -1);
    const newTotalAmount = currentType.reduce((sum, item) => {
      return sum + Number(item.amount);
    }, 0);

    const newTotalObject = {
      type: "Total",
      amount: newTotalAmount,
    };

    if (typeArray === income) {
      setIncome([...currentType, newTotalObject]);
    } else if (typeArray === expenses) {
      setExpenses([...currentType, newTotalObject]);
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <Container>
      {/* Sección de entrada para nuevos ingresos */}
      <IncAndExpContainer>
        <Input
          value={incomeType}
          placeholder="Type of income"
          onChange={(e) => setIncomeType(e.target.value)}
        ></Input>
        <Input
          type="number"
          placeholder="Income amount"
          style={{ height: "35px", borderRadius: "10px", maxWidth: "90%" }}
          value={newIncome}
          onChange={(e) => setNewIncome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addIncome(newIncome)}
        />
        <button
          style={{
            height: "35px",
            borderRadius: "10px",
            padding: "0 15px",
            backgroundColor: "#55F5ED",
            color: "#282C34",
            border: "none",
            cursor: "pointer",
          }}
          onClick={addIncome}
        >
          Add
        </button>
      </IncAndExpContainer>

      {/* Sección de entrada para nuevos gastos */}
      <ExpenseInputContainer>
        <Input
          value={expenseType}
          placeholder="Type of expense"
          style={{
            height: "35px",
            width: "150px",
            borderRadius: "10px",
            maxWidth: "90%",
            border: "1px solid #4fffff",
          }}
          onChange={(e) => setExpenseType(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Expense amount"
          style={{
            height: "35px",
            borderRadius: "10px",
            maxWidth: "90%",
            border: "1px solid #4fffff",
          }}
          value={newExpense}
          onChange={(e) => setNewExpense(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addExpense()}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <label style={{ fontSize: "11px", color: "#aaa" }}>Recurring</label>
          <label
            style={{
              position: "relative",
              display: "inline-block",
              width: "46px",
              height: "24px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={expenseIsRecurring}
              onChange={(e) => {
                const checked = e.target.checked;
                setExpenseIsRecurring(checked);
                if (checked) {
                  setShowAvailable(true);
                  setIsLeaving(false);
                } else {
                  setIsLeaving(true);
                  setTimeout(() => {
                    setShowAvailable(false);
                    setIsLeaving(false);
                  }, 300);
                }
              }}
              style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: expenseIsRecurring ? "#55F5ED" : "#555",
                borderRadius: "24px",
                transition: "background-color 300ms ease",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "3px",
                left: expenseIsRecurring ? "25px" : "3px",
                width: "18px",
                height: "18px",
                backgroundColor: "#282C34",
                borderRadius: "50%",
                transition: "left 300ms ease",
              }}
            />
          </label>
        </div>

        {showAvailable && (
          <AvailableFromWrapper $leaving={isLeaving}>
            <label
              style={{ fontSize: "11px", color: "#aaa", whiteSpace: "nowrap" }}
            >
              Available from day
            </label>
            <input
              type="number"
              min={1}
              max={31}
              value={availableFrom}
              onChange={(e) => setAvailableFrom(parseInt(e.target.value) || 1)}
              style={{
                width: "50px",
                height: "35px",
                borderRadius: "10px",
                textAlign: "center",
                border: "1px solid #4fffff",
                backgroundColor: "transparent",
                color: "#f0f0f0",
              }}
            />
          </AvailableFromWrapper>
        )}

        <button
          style={{
            height: "35px",
            borderRadius: "10px",
            padding: "0 15px",
            backgroundColor: "#55F5ED",
            color: "#282C34",
            border: "none",
            cursor: "pointer",
          }}
          onClick={addExpense}
        >
          Add
        </button>
      </ExpenseInputContainer>

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
      <Tables
        income={income}
        expenses={expenses}
        handleDelete={handleDelete}
        moneyInHand={salaryData.moneyInHand}
        setMoneyInHand={setMoneyInHand}
        handleEdit={handleEdit}
      />

      {/* Botón para guardar cambios manualmente */}
      <SaveButton onClick={saveChanges}>Save changes on Database</SaveButton>
    </Container>
  );
};

export default PersonalFinance;
