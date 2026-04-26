import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { updateUserData } from "../../../api/users";
import IncomeFlow from "./IncomeFlow";
import Tables from "./Tables";
import styled from "styled-components";

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

const IncAndExpContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: auto;
`;

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

const Expenses = () => {
  const { user, isAuthenticated, updateUser } = useContext(AuthContext);

  const incomeOptions = [
    "Choose one type of income",
    "Dividend",
    "Sells",
    "Services",
    "Extra",
    "Other",
  ];
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

  const defaultIncome = [
    { type: "Net Salary", amount: 0 },
    { type: "Total", amount: 0 },
  ];

  const defaultExpenses = [
    { type: "Dwelling", amount: 140000 },
    { type: "Telephone Bill", amount: 44000 },
    { type: "Internet Bill", amount: 29000 },
    { type: "Education", amount: 27000 },
    { type: "Total", amount: 240000 },
  ];

  const [income, setIncome] = useState(defaultIncome);
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [dateRange, setDateRange] = useState([null, null]);
  const [salaryData, setSalaryData] = useState({
    grossSalary: "",
    taxes: 0,
    vto: "",
    ot: "",
    isSalaried: null,
    cutDays: [1, 16], // default
  });

  const initialLoadDone = useRef(false);
  useEffect(() => {
    if (!isAuthenticated || !user) return
    if (initialLoadDone.current) return

    initialLoadDone.current = true

    setIncome(
      user.incomes && user.incomes.length > 0 ? user.incomes : defaultIncome
    );
    setExpenses(
      user.expenses && user.expenses.length > 0 ? user.expenses : defaultExpenses
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
      });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated || !dateRange[0] || !dateRange[1]) return
    if (!user?.payInfo?.paymentDates?.length) return

    const savedStart = new Date(user.payInfo.paymentDates[0]).getTime()
    const currentStart = new Date(dateRange[0]).getTime()

    if (savedStart === currentStart) return

    const autoSave = async () => {
      try {
        const payload = {
          incomes: income,
          expenses: expenses,
          payInfo: {
            paymentDates: dateRange,
            grossSalary: salaryData.grossSalary,
            taxes: salaryData.taxes,
            vto: 0,
            ot: 0,
            isSalaried: salaryData.isSalaried,
            cutDays: salaryData.cutDays,
          },
        }
        const updatedUser = await updateUserData(payload)
        updateUser(updatedUser)
        console.log("✅ Periodo auto-guardado")
      } catch (err) {
        console.error("Error al auto-guardar periodo:", err)
      }
    }

    autoSave()
  }, [dateRange])

  useEffect(() => {
    if (!initialLoadDone.current) return
    if (!isAuthenticated || !dateRange[0] || !dateRange[1]) return

    const autoSave = async () => {
      try {
        const payload = {
          incomes: income,
          expenses: expenses,
          payInfo: {
            paymentDates: dateRange,
            grossSalary: salaryData.grossSalary,
            taxes: salaryData.taxes,
            vto: salaryData.vto,
            ot: salaryData.ot,
            isSalaried: salaryData.isSalaried,
            cutDays: salaryData.cutDays,
          },
        }
        const updatedUser = await updateUserData(payload)
        updateUser(updatedUser)
        console.log("✅ CutDays auto-guardados")
      } catch (err) {
        console.error("Error al auto-guardar cutDays:", err)
      }
    }

    autoSave()
  }, [salaryData.cutDays[0], salaryData.cutDays[1]])

  useEffect(() => {
    if (!initialLoadDone.current) return
    setSalaryData(prev => ({ ...prev, vto: 0, ot: 0 }))
  }, [dateRange])

  const saveChanges = async () => {
    try {
      if (salaryData.isSalaried) {
        if (!dateRange[0] || !dateRange[1]) {
          alert("Please select a payroll period before saving.");
          return;
        }
      }

      const payload = {
        incomes: income,
        expenses: expenses,
        payInfo: {
          paymentDates: dateRange,
          grossSalary: salaryData.grossSalary,
          taxes: salaryData.taxes,
          vto: salaryData.vto,
          ot: salaryData.ot,
          isSalaried: salaryData.isSalaried,
          cutDays: salaryData.cutDays,
        },
      };

      const updatedUser = await updateUserData(payload);
      updateUser(updatedUser);
      alert("Changes saved!");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  const [newIncome, setNewIncome] = useState();
  const [incomeType, setIncomeType] = useState(incomeOptions[0]);
  const [newExpense, setNewExpense] = useState();
  const [expenseType, setExpenseType] = useState(expenseOptions[0]);

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

  return (
    <Container>
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

      <IncomeFlow
        income={income}
        setIncome={setIncome}
        dateRange={dateRange}
        setDateRange={setDateRange}
        salaryData={salaryData}
        setSalaryData={setSalaryData}
      />

      <Tables income={income} expenses={expenses} handleDelete={handleDelete} />

      <SaveButton onClick={saveChanges}>Save changes on Database</SaveButton>
    </Container>
  );
};

export default Expenses;
