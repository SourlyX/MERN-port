import { useState, useEffect } from "react"
import PeriodSelector from "./PeriodSelector"
import styled from "styled-components"
import UndersAndExtras from "./UndersAndExtras"
import { set } from "date-fns"

const Container = styled.div`
  width: 100%;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items:center;
`

const IncomeContainer = styled.div`
  width: 95%;
  max-width: 800px;
  margin: 10px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const Selection = styled.select`
  width: 45%;
  max-width: 150px;
  border-radius: 10px;
`

const QS = styled.p`
  width:45%;
`

const Input = styled.input`
  width: 45%;
  max-width: 150px;
  border-radius: 10px;
`

const IncomeFlow = ({ income, setIncome }) => {
  const isSalaried = ["===Select one===", "Yes", "No"]
  const [salaried, setSalaried] = useState()
  const [newSalary, setNewSalary] = useState("")
  const [taxes, setTaxes] = useState(0)
  const [VTO, setVTO] = useState("")
  const [OT, setOT] = useState("")
  const [dateRange, setDateRange] = useState([null, null])

  useEffect(() => {
    const minutePay = newSalary/15/6/60
    const vtoDeduction = minutePay*VTO
    const otAddition = minutePay*OT
    const netSalary = (newSalary-vtoDeduction+otAddition)-newSalary*(taxes/100)
    
    if(taxes > 100 || taxes < 0){
      alert("Please input valid taxes")
      setTaxes(0)
      return
    }
    if(VTO < 0){
      alert("Please input valid VTO minutes")
      setVTO(0)
      return
    }
    if(OT < 0){
      alert("Please input valid OT minutes")
      setOT(0)
      return
    }

    const breakdownDetails = []
    const condition1 = otAddition > 0
    const condition2 = vtoDeduction > 0
    const condition3 = taxes > 0
    if(condition1 || condition2 || condition3){
      breakdownDetails.push({ label: "Gross Salary", amount: newSalary})
    }
    if(condition1){
      breakdownDetails.push({ label: `+ Overtime (${OT} min)`, amount: otAddition })
    }
    if(condition2){
      breakdownDetails.push({ label: `- Unpaid Time (${VTO} min)`, amount: vtoDeduction })
    }
    if(condition3){
      breakdownDetails.push({ label: `- Taxes (${taxes}%)`, amount: newSalary*(taxes/100) })
    }

    const oldIncome = income.slice(1)
    const updatedSalary = {
      type: "Net Salary",
      amount: parseFloat(netSalary).toFixed(2),
      breakDown: breakdownDetails
    }
    
    let total = income.at(-1)
    total.amount = (parseFloat(total.amount) - parseFloat(income[0].amount) + parseFloat(updatedSalary.amount)).toFixed(2)
    setIncome([updatedSalary, ...oldIncome])
  }, [newSalary, taxes, VTO, OT])

  return (
    <Container>
      <IncomeContainer>
        <QS>Are you a salaried person?</QS>
        <Selection
          value={salaried}
          onChange={(e) => setSalaried(e.target.value)}
        >
          {isSalaried.map((one) => (
            <option key={one}>{one}</option>
          ))}
        </Selection>
      </IncomeContainer>

      {salaried === "Yes" && (
        <>
        <PeriodSelector
          calendarName={"🗓️ Current Payroll Period"}
          selectorName={"Payroll period"}
          dateRange={dateRange}
          setDateRange={setDateRange}/>
        <IncomeContainer>
          <QS>How much is your gross salary?</QS>
          <Input
            type="number"
            min="1"
            placeholder="Salary"
            value={newSalary}
            onChange={(e) => setNewSalary(e.target.value)}
            />
        </IncomeContainer>
        </>
      )}
      
      {(newSalary !== "" && salaried === "Yes") && (
        <>
        <IncomeContainer>
          <QS>How much do you pay in taxes? (%)</QS>
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="Taxes"
            value={taxes}
            onChange={(e) => setTaxes(e.target.value)}
          />
        </IncomeContainer>
          {dateRange[1] !== null && (<UndersAndExtras VTO={VTO} setVTO={setVTO} OT={OT} setOT={setOT}/>)}
        </>
      )}

    </Container>
  )
}

export default IncomeFlow