import { useState, useContext, useEffect } from "react"
import { updateUserData } from '../../../api/users'
import { AuthContext } from '../../../context/AuthContext'
import Tables from "./Tables"
import IncomeFlow from "./IncomeFlow"
import styled from "styled-components"

const Container = styled.div`
  margin-top: 2.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const IncAndExpContainer = styled.div`
  margin: 5px;
`

const SaveButton = styled.button`
  background-color: #61dafb;
  border: none;
  color: #282c34;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px  0px 30px 0px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #21a1f1;
  }
`

const Expenses = () => {
  const { user, isAuthenticated, updateUser } = useContext(AuthContext)

  const incomeOptions = ["Choose one type of income", "Dividend", "Sells", "Services", "Extra", "Other"]
  const expenseOptions = ["Choose one type of expense", "Dwelling", "Telephone Bill", "Internet Bill", "Water Bill",
    "Electrical Bill", "Feeding", "Transportation", "Health", "Edu cation", "Debts", "Owed to people", "Leisure", "Clothing"]

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

  useEffect(() => {
    if (isAuthenticated && user) {
      setIncome(user.incomes && user.incomes.length > 0 ? user.incomes : defaultIncome)
      setExpenses(user.expenses && user.expenses.length > 0 ? user.expenses : defaultExpenses)
    }
  }, [isAuthenticated, user])

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const updatedUser = await updateUserData(token, income, expenses)

      // actualizar estado global (AuthContext)
      updateUser(updatedUser)
      console.log("Changes saved")
    } catch (err) {
      console.error(err)
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

      <IncomeFlow income={income} setIncome={setIncome} />

      <Tables income={income} expenses={expenses} handleDelete={handleDelete} />

      <SaveButton onClick={saveChanges}>Save changes on Database</SaveButton>

    </Container>
  )
}

export default Expenses