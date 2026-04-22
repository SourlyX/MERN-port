import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { updateUserData } from "../../../api/users"
import IncomeFlow from "./IncomeFlow"
import Tables from "./Tables"
import styled from "styled-components"

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
`

const IncAndExpContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: auto;
`

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
`

// ─── Utilidad: calcular la quincena actual ───
const getCurrentQuincena = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const year = today.getFullYear()
  const month = today.getMonth()
  const day = today.getDate()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  if (day <= 15) {
    return [new Date(year, month, 1), new Date(year, month, 15)]
  } else {
    return [new Date(year, month, 16), new Date(year, month, daysInMonth)]
  }
}

// ─── Utilidad: verificar si "hoy" está dentro del rango ───
const isTodayInRange = (start, end) => {
  if (!start || !end) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const s = new Date(start)
  s.setHours(0, 0, 0, 0)
  const e = new Date(end)
  e.setHours(0, 0, 0, 0)
  return today >= s && today <= e
}

const Expenses = () => {
  const { user, isAuthenticated, updateUser } = useContext(AuthContext)

  const incomeOptions = ["Choose one type of income", "Dividend", "Sells", "Services", "Extra", "Other"]
  const expenseOptions = ["Choose one type of expense", "Dwelling", "Telephone Bill", "Internet Bill", "Water Bill",
    "Electrical Bill", "Feeding", "Transportation", "Health", "Education", "Debts", "Owed to people", "Leisure", "Clothing"]

  const defaultIncome = [
    { type: "Net Salary", amount: 0 },
    { type: "Total", amount: 0 }
  ]

  const defaultExpenses = [
    { type: "Dwelling", amount: 140000 },
    { type: "Telephone Bill", amount: 44000 },
    { type: "Internet Bill", amount: 29000 },
    { type: "Education", amount: 27000 },
    { type: "Total", amount: 240000 }
  ]

  const [income, setIncome] = useState(defaultIncome)
  const [expenses, setExpenses] = useState(defaultExpenses)
  const [dateRange, setDateRange] = useState([null, null])
  const [salaryData, setSalaryData] = useState({
    grossSalary: "",
    taxes: 0,
    vto: "",
    ot: "",
    isSalaried: false
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      setIncome(user.incomes && user.incomes.length > 0 ? user.incomes : defaultIncome)
      setExpenses(user.expenses && user.expenses.length > 0 ? user.expenses : defaultExpenses)

      // ─── Lógica de auto-ajuste del periodo guardado ───
      if (user.payInfo?.paymentDates?.length === 2) {
        const savedStart = new Date(user.payInfo.paymentDates[0])
        const savedEnd = new Date(user.payInfo.paymentDates[1])

        if (isTodayInRange(savedStart, savedEnd)) {
          // ✅ Está dentro del periodo guardado → usar tal cual
          setDateRange([savedStart, savedEnd])
        } else {
          // ⚠️ Fuera del periodo → mover automáticamente a la quincena actual
          const [qStart, qEnd] = getCurrentQuincena()
          setDateRange([qStart, qEnd])
          console.log("📅 Payroll period auto-adjusted to current quincena:", qStart, "→", qEnd)
        }
      }

      if (user.payInfo) {
        setSalaryData({
          grossSalary: user.payInfo.grossSalary || "",
          taxes: user.payInfo.taxes || 0,
          vto: user.payInfo.vto || "",
          ot: user.payInfo.ot || "",
          isSalaried: user.payInfo.isSalaried || false
        })
      }
    }
  }, [isAuthenticated, user])

  const saveChanges = async () => {
    try {
      if (salaryData.isSalaried) {
        if (!dateRange[0] || !dateRange[1]) {
          alert("⚠️ Please select a payroll period before saving.")
          return
        }

        // Validar que el rango sea ~15 días (con tolerancia para febrero)
        const diffDays = Math.round(
          (dateRange[1] - dateRange[0]) / (1000 * 60 * 60 * 24)
        ) + 1 // +1 porque incluye ambos días

        if (diffDays < 13 || diffDays > 16) {
          alert(`⚠️ Payroll period must be approximately 15 days (got ${diffDays} days).`)
          return
        }

        if (!isTodayInRange(dateRange[0], dateRange[1])) {
          alert("⚠️ Cannot save: current date is outside the payroll period.")
          return
        }
      }

      const payload = {
        incomes: income,
        expenses: expenses,
        payInfo: {
          paymentDates: dateRange.filter(d => d !== null),
          grossSalary: salaryData.grossSalary,
          taxes: salaryData.taxes,
          vto: salaryData.vto,
          ot: salaryData.ot,
          isSalaried: salaryData.isSalaried
        }
      }

      const updatedUser = await updateUserData(payload)
      updateUser(updatedUser)
      alert("✅ Changes saved!")
    } catch (err) {
      console.error(err)
      alert("❌ Error: " + err.message)
    }
  }

  const [newIncome, setNewIncome] = useState()
  const [incomeType, setIncomeType] = useState(incomeOptions[0])
  const [newExpense, setNewExpense] = useState()
  const [expenseType, setExpenseType] = useState(expenseOptions[0])

  const addIncome = () => {
    if (!newIncome) {
      alert("Please input an income")
      return
    }
    if (incomeType === incomeOptions[0]) {
      alert("Please select a type of income")
      return
    }

    const newIncomeObject = {
      type: incomeType,
      amount: parseFloat(newIncome)
    }

    const currentIncomes = income.slice(0, -1)
    let total = income.at(-1)
    const updatedIncomes = [...currentIncomes, newIncomeObject]
    total.amount = total.amount + newIncomeObject.amount
    setIncome([...updatedIncomes, total])
    setNewIncome("")
  }

  const addExpense = () => {
    if (!newExpense) {
      alert("Please input an expense")
      return
    }
    if (expenseType === expenseOptions[0]) {
      alert("Please select a type of expense")
      return
    }

    const newExpenseObject = {
      type: expenseType,
      amount: parseFloat(newExpense)
    }

    const currentExpenses = expenses.slice(0, -1)
    let total = expenses.at(-1)
    const updatedExpenses = [...currentExpenses, newExpenseObject]
    total.amount = total.amount + newExpenseObject.amount
    setExpenses([...updatedExpenses, total])
    setNewExpense("")
  }

  const handleDelete = (typeFromDelete, target) => {
    const updatedType = typeFromDelete.filter(type => { return type !== target })
    const currentType = updatedType.slice(0, -1)
    const newTotalAmount = currentType.reduce((sum, item) => {
      return sum + Number(item.amount)
    }, 0)

    const newTotalObject = {
      type: "Total",
      amount: newTotalAmount
    }

    if (typeFromDelete === income) {
      setIncome([...currentType, newTotalObject])
    } else if (typeFromDelete === expenses) {
      setExpenses([...currentType, newTotalObject])
    }
  }

  return (
    <Container>
      <IncAndExpContainer>
        <select
          value={incomeType}
          style={{ height: "35px", width: "150px", borderRadius: "10px", marginRight: "10px" }}
          onChange={(e) => setIncomeType(e.target.value)}
        >
          {incomeOptions.map((income) => (
            <option key={income}>{income}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Income amount"
          style={{ height: "35px", borderRadius: "10px" }}
          value={newIncome}
          onChange={(e) => setNewIncome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addIncome(newIncome)}
        />
      </IncAndExpContainer>
      <IncAndExpContainer>
        <select
          value={expenseType}
          style={{ height: "35px", width: "150px", borderRadius: "10px", marginRight: "10px" }}
          onChange={(e) => setExpenseType(e.target.value)}
        >
          {expenseOptions.map((income) => (
            <option key={income}>{income}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Expense amount"
          style={{ height: "35px", borderRadius: "10px" }}
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
  )
}

export default Expenses