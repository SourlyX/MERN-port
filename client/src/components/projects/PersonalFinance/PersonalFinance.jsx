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

/** Input estilizado para los campos de tipo y monto */
const Input = styled.input`
  height: 35px;
  border-radius: 10px;
  max-width: 90%;
  border: 1px solid #4fffff;
`;

/** Contenedor para el campo "available from" con animación de entrada/salida */
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

/** Contenedor para campos adicionales de frecuencia con animación de entrada/salida */
const FrequencyExtrasWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;
  animation: ${({ $leaving }) => ($leaving ? "extrasOut" : "extrasIn")} 300ms
    ease forwards;

  @keyframes extrasIn {
    from {
      opacity: 0;
      transform: translateX(-20px) translateY(-6px);
      max-width: 0;
    }
    to {
      opacity: 1;
      transform: translateX(0) translateY(0);
      max-width: 400px;
    }
  }

  @keyframes extrasOut {
    from {
      opacity: 1;
      transform: translateX(0) translateY(0);
      max-width: 400px;
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
    {
      type: "Dwelling",
      amount: 100000,
      frequency: "monthly",
      paid: false,
      carriedOver: false,
    },
    {
      type: "Telephone Bill",
      amount: 44000,
      frequency: "monthly",
      paid: false,
      carriedOver: false,
    },
    {
      type: "Internet Bill",
      amount: 29000,
      frequency: "monthly",
      paid: false,
      carriedOver: false,
    },
    {
      type: "Education",
      amount: 27000,
      frequency: "monthly",
      paid: false,
      carriedOver: false,
    },
    { type: "Total", amount: 200000 },
  ];

  /* -------------------- Estado del componente -------------------- */

  const [income, setIncome] = useState(defaultIncome);
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [expenseFrequency, setExpenseFrequency] = useState(null);
  const [expenseStartDate, setExpenseStartDate] = useState("");
  const [expenseStartDate2, setExpenseStartDate2] = useState("");
  const [showFrequencyExtras, setShowFrequencyExtras] = useState(false);
  const [incomeFrequency, setIncomeFrequency] = useState(null);
  const [incomeStartDate, setIncomeStartDate] = useState("");
  const [showFrequencyExtrasIncome, setShowFrequencyExtrasIncome] =
    useState(false);
  const [isLeavingExtrasIncome, setIsLeavingExtrasIncome] = useState(false);
  const [isLeavingExtras, setIsLeavingExtras] = useState(false);
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

  /* -------------------- getToday -------------------- */
  // 🧪 TEST: cambia esta fecha para simular días futuros. En prod: new Date()
  const getToday = () => {
    return new Date("2026-03-01");
    return new Date();
  };

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
   * Efecto de auto-guardado al cambiar ingresos o gastos.
   * Se activa solo después de la carga inicial y si el usuario está autenticado.
   */
  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (!isAuthenticated) return;

    const autoSave = async () => {
      try {
        const payload = buildPayload();
        const updatedUser = await updateUserData(payload);
        updateUser(updatedUser);
      } catch (err) {
        console.error("Error al auto-guardar income/expenses:", err);
      }
    };

    autoSave();
  }, [income, expenses]);

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

    const loadedIncomes =
      user.incomes && user.incomes.length > 0 ? user.incomes : defaultIncome;

    const today = getToday();
    today.setHours(0, 0, 0, 0);

    const { income: autoChecked, changed } = applyAutoCheck(
      loadedIncomes,
      today,
    );

    if (changed) {
      setIncome(autoChecked);
      updateUserData({
        incomes: autoChecked,
        expenses: user.expenses,
        payInfo: { ...user.payInfo },
      })
        .then((updatedUser) => updateUser(updatedUser))
        .catch(console.error);
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
    console.log("incomes al entrar:", JSON.stringify(user.incomes, null, 2));
    const today = getToday();
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
    console.log("lastPayDate en DB:", user.payInfo.lastPayDate);
    console.log("startDate:", startDate, "today:", today);
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
    console.log("count:", count, "missedCutDates:", missedCutDates);

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
          const { income: autoChecked, changed } = applyAutoCheck(
            updatedIncome,
            today,
          );
          if (changed) {
            setIncome(autoChecked);
            updateUserData({
              incomes: autoChecked,
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
              .then((u) => updateUser(u))
              .catch(console.error);
          }
        })
        .catch(console.error);

      // 6. Múltiples períodos
    } else {
      const baseIncomes = user.incomes?.slice(0, -1) || [];

      const unpaidRecurring = baseIncomes
        .filter((i) => i.frequency && !i.paid)
        .map((i) => ({ ...i, carriedOver: true }));

      // Siempre se genera una instancia nueva para el mes actual
      const freshRecurring = baseIncomes
        .filter((i) => i.frequency)
        .map((i) => ({
          ...i,
          paid: false,
          carriedOver: false,
          instanceId:
            Date.now().toString() + Math.random().toString(36).slice(2),
        }));

      const currentNetSalary = user.incomes?.find(
        (i) => i.type === "Net Salary",
      ) || { type: "Net Salary", amount: 0 };

      const preAutoCheck = [
        currentNetSalary,
        ...unpaidRecurring,
        ...freshRecurring,
        { type: "Total", amount: 0 },
      ];

      const { income: nextIncome } = applyAutoCheck(preAutoCheck, today);

      const baseExpenses = user.expenses?.slice(0, -1) || [];
      const nextExpenses = baseExpenses
        .filter((e) => e.frequency)
        .map((e) => ({ ...e, paid: false, carriedOver: !e.paid }));
      const finalExpenses = [...nextExpenses, { type: "Total", amount: 0 }];

      console.log("preAutoCheck:", JSON.stringify(preAutoCheck, null, 2));
      await updateUserData({
        incomes: nextIncome,
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
          setIncome(nextIncome);
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

  /** Alterna el estado de pago de un gasto recurrente y recalcula el total considerando solo los gastos pagados.
   * @param {number} index - Índice del gasto a modificar en la lista de expenses.
   */
  const handleTogglePaid = (index) => {
    const updatedExpenses = expenses.map((e, i) =>
      i === index ? { ...e, paid: !e.paid } : e,
    );

    const currentExpenses = updatedExpenses.slice(0, -1);
    const newTotalAmount = currentExpenses.reduce(
      (sum, e) => sum + (e.paid ? e.amount : 0),
      0,
    );

    setExpenses([
      ...currentExpenses,
      { type: "Total", amount: newTotalAmount },
    ]);
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
    if (incomeFrequency && !incomeStartDate) {
      alert("Please select a start date");
      return;
    }

    let appearsFrom = null;
    if (incomeFrequency) {
      const start = new Date(incomeStartDate);
      const months = anticipationMonths[incomeFrequency] || 0;
      appearsFrom = new Date(
        start.getFullYear(),
        start.getMonth() - months,
        1,
      ).toISOString();
    }

    const newIncomeObject = {
      type: incomeType,
      amount: parseFloat(newIncome),
      frequency: incomeFrequency || null,
      appearsFrom,
      ...(incomeFrequency && {
        paid: false,
        carriedOver: false,
        instanceId: Date.now().toString(),
      }),
    };

    const currentIncomes = income.slice(0, -1);
    const oldTotal = income.at(-1);
    const addsToTotal = !incomeFrequency;

    setIncome([
      ...currentIncomes,
      newIncomeObject,
      {
        type: "Total",
        amount: oldTotal.amount + (addsToTotal ? newIncomeObject.amount : 0),
      },
    ]);
    setNewIncome("");
    setIncomeType("");
    setIncomeFrequency(null);
    setIncomeStartDate("");
    setShowFrequencyExtrasIncome(false);
  };

  /* Mapeo de frecuencias a meses de anticipación para calcular la fecha "appearsFrom" al agregar ingresos/gastos recurrentes */
  const anticipationMonths = {
    biweekly: 0,
    monthly: 0,
    quarterly: 1,
    fourmonthly: 1,
    semiannual: 2,
    annual: 3,
  };

  /* Revisa los ingresos con frecuencia para marcar como pagados los que ya deberían
  aparecer según su fecha "appearsFrom", y recalcula el total considerando solo
  los ingresos sin frecuencia o los recurrentes que ya aparecieron. */
  const applyAutoCheck = (incomeArray, today) => {
    let changed = false;

    const currentItems = incomeArray.slice(0, -1);
    const updated = currentItems.map((item) => {
      if (
        item.frequency &&
        !item.paid &&
        !item.carriedOver &&
        item.appearsFrom &&
        new Date(item.appearsFrom) <= today
      ) {
        changed = true;
        return { ...item, paid: true };
      }
      return item;
    });

    if (!changed) return { income: incomeArray, changed: false };

    const newTotal = updated.reduce((sum, item) => {
      if (!item.frequency || item.paid) return sum + item.amount;
      return sum;
    }, 0);

    return {
      income: [...updated, { type: "Total", amount: newTotal }],
      changed: true,
    };
  };

  /* Permite al usuario marcar manualmente como pagado un ingreso recurrente que ya apareció,
    o revertirlo a no pagado (con opción de marcar como "carried over" si se paga fuera de tiempo). */
  const handleTogglePaidIncome = (instanceId) => {
    const currentIncomes = income.slice(0, -1);
    const currentTotal = income.at(-1).amount;
    const target = currentIncomes.find((i) => i.instanceId === instanceId);
    if (!target) return;

    if (!target.paid && target.carriedOver) {
      // Mes siguiente — suma a moneyInHand y desaparece
      const confirmed = window.confirm(
        `Mark "${target.type}" as paid? It will be added to your Money in Hand.`,
      );
      if (!confirmed) return;

      const filtered = currentIncomes.filter(
        (i) => i.instanceId !== instanceId,
      );
      const newMoneyInHand = salaryData.moneyInHand + target.amount;

      setIncome([...filtered, { type: "Total", amount: currentTotal }]);
      setSalaryData((prev) => ({ ...prev, moneyInHand: newMoneyInHand }));

      updateUserData({
        incomes: [...filtered, { type: "Total", amount: currentTotal }],
        expenses,
        payInfo: {
          ...salaryData,
          moneyInHand: newMoneyInHand,
          paymentDates: dateRange,
        },
      })
        .then((updatedUser) => updateUser(updatedUser))
        .catch(console.error);
    } else if (!target.paid) {
      // Mes actual — se queda en tabla, suma al Total
      const updated = currentIncomes.map((i) =>
        i.instanceId === instanceId ? { ...i, paid: true } : i,
      );
      setIncome([
        ...updated,
        { type: "Total", amount: currentTotal + target.amount },
      ]);
    } else {
      // Desmarcar — vuelve a gris, resta del Total
      const updated = currentIncomes.map((i) =>
        i.instanceId === instanceId ? { ...i, paid: false } : i,
      );
      setIncome([
        ...updated,
        { type: "Total", amount: currentTotal - target.amount },
      ]);
    }
  };

  /**
   * Actualiza el dinero disponible en mano/banco dentro de salaryData
   * sin pisar el resto de los campos del estado.
   * @param {number} value - Nuevo monto de dinero en mano
   */
  const setMoneyInHand = (value) =>
    setSalaryData((prev) => ({ ...prev, moneyInHand: value }));

  /**
   * Agrega un nuevo gasto a la lista, validando que se haya ingresado un monto,
   * seleccionado un tipo y, si es recurrente, configurado la frecuencia y fecha de inicio.
   * Recalcula el total considerando solo los gastos pagados.
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
    if (expenseFrequency && !expenseStartDate) {
      alert("Please select a start date");
      return;
    }
    if (expenseFrequency === "biweekly" && !expenseStartDate2) {
      alert("Please select the second biweekly date");
      return;
    }

    let appearsFrom = null;
    if (expenseFrequency) {
      const start = new Date(expenseStartDate);
      const months = anticipationMonths[expenseFrequency] || 0;
      appearsFrom = new Date(
        start.getFullYear(),
        start.getMonth() - months,
        1,
      ).toISOString();
    }

    const hasFrequency = !!expenseFrequency;

    const newExpenseObject = {
      type: expenseType,
      amount: parseFloat(newExpense),
      frequency: expenseFrequency || null,
      appearsFrom,
      paid: !hasFrequency,
      carriedOver: false,
      ...(expenseFrequency === "biweekly" && {
        startDate2: new Date(expenseStartDate2).toISOString(),
      }),
    };

    const currentExpenses = expenses.slice(0, -1);
    const updatedExpenses = [...currentExpenses, newExpenseObject];
    const newTotalAmount = updatedExpenses.reduce(
      (sum, e) => sum + (e.paid ? e.amount : 0),
      0,
    );

    setExpenses([
      ...updatedExpenses,
      { type: "Total", amount: newTotalAmount },
    ]);
    setNewExpense("");
    setExpenseType("");
    setExpenseFrequency(null);
    setExpenseStartDate("");
    setExpenseStartDate2("");
    setShowFrequencyExtras(false);
  };

  /**
   * Elimina un ingreso o gasto de la lista correspondiente y recalcula el total automáticamente.
   * Si el gasto tiene frecuencia, solicita confirmación antes de eliminar.
   * @param {Array} typeFromDelete - Lista de origen (income o expenses)
   * @param {Object} target - Elemento a eliminar
   */
  const handleDelete = (typeFromDelete, target) => {
    if (target.frequency) {
      const label =
        target.frequency.charAt(0).toUpperCase() + target.frequency.slice(1);
      const confirmed = window.confirm(
        `Are you sure you want to delete this ${label} payment?`,
      );
      if (!confirmed) return;
    }

    const updatedType = typeFromDelete.filter((item) => item !== target);
    const currentType = updatedType.slice(0, -1);

    const newTotalAmount = currentType.reduce((sum, item) => {
      if (typeFromDelete === expenses)
        return sum + (item.paid ? item.amount : 0);
      return sum + Number(item.amount);
    }, 0);

    const newTotalObject = { type: "Total", amount: newTotalAmount };

    if (typeFromDelete === income) setIncome([...currentType, newTotalObject]);
    else if (typeFromDelete === expenses)
      setExpenses([...currentType, newTotalObject]);
  };

  /**
   * Edita un elemento (ingreso o gasto) de la lista correspondiente
   * y recalcula el total automáticamente.
   * @param {Array} typeFromEdit - Lista de origen (income o expenses)
   * @param {Object} target - Elemento a editar
   * @param {string} newType - Nuevo nombre/tipo del elemento
   * @param {number} newAmount - Nuevo monto del elemento
   * @param {string} newFrequency - Nueva frecuencia del elemento
   * @param {number} startDay - Día de inicio para la frecuencia
   */
  const handleEdit = (
    typeArray,
    target,
    newType,
    newAmount,
    newFrequency,
    startDay,
  ) => {
    let appearsFrom = null;
    if (newFrequency) {
      const today = getToday();
      const months = anticipationMonths[newFrequency] || 0;
      appearsFrom = new Date(
        today.getFullYear(),
        today.getMonth() - months,
        startDay || 1,
      ).toISOString();
    }

    const updatedType = typeArray.map((item) => {
      if (item.type === target) {
        return {
          ...item,
          type: newType,
          amount: parseFloat(newAmount),
          frequency: newFrequency || null,
          appearsFrom,
        };
      }
      return item;
    });

    const currentType = updatedType.slice(0, -1);
    const newTotalAmount = currentType.reduce((sum, item) => {
      if (typeArray === expenses) return sum + (item.paid ? item.amount : 0);
      return sum + Number(item.amount);
    }, 0);

    const newTotalObject = { type: "Total", amount: newTotalAmount };

    if (typeArray === income) setIncome([...currentType, newTotalObject]);
    else if (typeArray === expenses)
      setExpenses([...currentType, newTotalObject]);
  };

  /** Maneja el cambio de frecuencia para un ingreso recurrente, mostrando u ocultando el campo adicional
   * de fecha de inicio según corresponda, y reseteando la fecha al ocultar.
   * @param {string} value - Nueva frecuencia seleccionada (o "none" para eliminar la frecuencia)
   * */
  const handleIncomeFrequencyChange = (value) => {
    const freq = value === "none" ? null : value;
    setIncomeFrequency(freq);
    if (freq) {
      setShowFrequencyExtrasIncome(true);
      setIsLeavingExtrasIncome(false);
    } else {
      setIsLeavingExtrasIncome(true);
      setTimeout(() => {
        setShowFrequencyExtrasIncome(false);
        setIsLeavingExtrasIncome(false);
        setIncomeStartDate("");
      }, 300);
    }
  };

  /** Maneja el cambio de frecuencia para un gasto recurrente, mostrando u ocultando los campos
   * adicionales de fecha de inicio según corresponda, y reseteando las fechas al ocultar.
   * @param {string} value - Nueva frecuencia seleccionada (o "none" para eliminar la frecuencia)
   * */
  const handleFrequencyChange = (value) => {
    const freq = value === "none" ? null : value;
    setExpenseFrequency(freq);
    if (freq) {
      setShowFrequencyExtras(true);
      setIsLeavingExtras(false);
    } else {
      setIsLeavingExtras(true);
      setTimeout(() => {
        setShowFrequencyExtras(false);
        setIsLeavingExtras(false);
        setExpenseStartDate("");
        setExpenseStartDate2("");
      }, 300);
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
        />
        <Input
          type="number"
          placeholder="Income amount"
          style={{ height: "35px", borderRadius: "10px", maxWidth: "90%" }}
          value={newIncome}
          onChange={(e) => setNewIncome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addIncome()}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <label style={{ fontSize: "11px", color: "#aaa" }}>Frequency</label>
          <select
            value={incomeFrequency || "none"}
            onChange={(e) => handleIncomeFrequencyChange(e.target.value)}
            style={{
              height: "35px",
              borderRadius: "10px",
              padding: "0 8px",
              backgroundColor: incomeFrequency ? "#55F5ED" : "#383838",
              color: incomeFrequency ? "#282C34" : "#f0f0f0",
              border: "1px solid #4fffff",
              cursor: "pointer",
              transition: "background-color 300ms ease, color 300ms ease",
            }}
          >
            <option value="none">None</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="fourmonthly">Four-monthly</option>
            <option value="semiannual">Semiannual</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        {showFrequencyExtrasIncome && (
          <FrequencyExtrasWrapper $leaving={isLeavingExtrasIncome}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <label
                style={{
                  fontSize: "11px",
                  color: "#aaa",
                  whiteSpace: "nowrap",
                }}
              >
                Start date
              </label>
              <input
                type="date"
                value={incomeStartDate}
                onChange={(e) => setIncomeStartDate(e.target.value)}
                style={{
                  height: "35px",
                  borderRadius: "10px",
                  padding: "0 8px",
                  border: "1px solid #4fffff",
                  backgroundColor: "transparent",
                  color: "#f0f0f0",
                }}
              />
            </div>
          </FrequencyExtrasWrapper>
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
          <label style={{ fontSize: "11px", color: "#aaa" }}>Frequency</label>
          <select
            value={expenseFrequency || "none"}
            onChange={(e) => handleFrequencyChange(e.target.value)}
            style={{
              height: "35px",
              borderRadius: "10px",
              padding: "0 8px",
              backgroundColor: expenseFrequency ? "#55F5ED" : "#383838",
              color: expenseFrequency ? "#282C34" : "#f0f0f0",
              border: "1px solid #4fffff",
              cursor: "pointer",
              transition: "background-color 300ms ease, color 300ms ease",
            }}
          >
            <option value="none">None</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="fourmonthly">Four-monthly</option>
            <option value="semiannual">Semiannual</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        {showFrequencyExtras && (
          <FrequencyExtrasWrapper $leaving={isLeavingExtras}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <label
                style={{
                  fontSize: "11px",
                  color: "#aaa",
                  whiteSpace: "nowrap",
                }}
              >
                Start date
              </label>
              <input
                type="date"
                value={expenseStartDate}
                onChange={(e) => setExpenseStartDate(e.target.value)}
                style={{
                  height: "35px",
                  borderRadius: "10px",
                  padding: "0 8px",
                  border: "1px solid #4fffff",
                  backgroundColor: "transparent",
                  color: "#f0f0f0",
                }}
              />
            </div>

            {expenseFrequency === "biweekly" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <label
                  style={{
                    fontSize: "11px",
                    color: "#aaa",
                    whiteSpace: "nowrap",
                  }}
                >
                  Second date
                </label>
                <input
                  type="date"
                  value={expenseStartDate2}
                  onChange={(e) => setExpenseStartDate2(e.target.value)}
                  style={{
                    height: "35px",
                    borderRadius: "10px",
                    padding: "0 8px",
                    border: "1px solid #4fffff",
                    backgroundColor: "transparent",
                    color: "#f0f0f0",
                  }}
                />
              </div>
            )}
          </FrequencyExtrasWrapper>
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
        handleTogglePaid={handleTogglePaid}
        handleTogglePaidIncome={handleTogglePaidIncome}
        moneyInHand={salaryData.moneyInHand}
        setMoneyInHand={setMoneyInHand}
        handleEdit={handleEdit}
      />
    </Container>
  );
};
export default PersonalFinance;
