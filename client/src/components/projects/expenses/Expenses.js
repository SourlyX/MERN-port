import { useState } from "react"
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

const IncomeContainer = styled.div`
  margin: 5px;
`

const ExpenseContainer = styled.div`
  margin: 5px;
`

const Expenses = ({ income, setIncome, expenses, setExpenses }) => {
  const incomeOptions = ["Choose one type of income", "Salary", "Dividend", "Sells", "Services", "Extra", "Other"]
  const expenseOptions = ["Choose one type of expense", "Dwelling", "Telephone Bill", "Internet Bill", "Water Bill",
    "Electrical Bill", "Feeding", "Transportation", "Health", "Education", "Debts", "Owed to people", "Leisure", "Clothing"]
  
  const [newIncome, setNewIncome] = useState()
  const [incomeType, setIncomeType] = useState(incomeOptions[0])

  const [newExpense, setNewExpense] = useState()
  const [expenseType, setExpenseType] = useState(expenseOptions[0])

  const addIncome = () => {
    if (!newIncome) {
      alert("Please input an income")
      return
    }
    if(incomeType === incomeOptions[0]){
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

    if(expenseType === expenseOptions[0]){
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

    if (typeFromDelete === income){
      setIncome([...currentType, newTotalObject])
    } else if (typeFromDelete === expenses){
      setExpenses([...currentType, newTotalObject])
    }
  }

return (
  <Container>
    <IncomeContainer>
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
    </IncomeContainer>
    <ExpenseContainer>
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
    </ExpenseContainer>

    <IncomeFlow income={income} setIncome={setIncome}/>
    
    <Tables income={income} expenses={expenses} handleDelete={handleDelete}/>

  </Container>
)}

export default Expenses