import { useEffect } from "react"
import PeriodSelector from "./PeriodSelector"
import styled from "styled-components"
import UndersAndExtras from "./UndersAndExtras"

const Container = styled.div`
  width: 100%;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 45%;
`

const Input = styled.input`
  width: 45%;
  max-width: 150px;
  border-radius: 10px;
`

const IncomeFlow = ({ income, setIncome, dateRange, setDateRange, salaryData, setSalaryData }) => {
  const isSalariedOptions = ["===Select one===", "Yes", "No"]

  // Derivar todo de salaryData — sin estados locales
  const salaried = salaryData.isSalaried ? "Yes" : "===Select one==="
  const newSalary = salaryData.grossSalary
  const taxes = salaryData.taxes
  const VTO = salaryData.vto
  const OT = salaryData.ot

  // Helper para actualizar un campo de salaryData
  const updateField = (field, value) => {
    setSalaryData(prev => ({ ...prev, [field]: value }))
  }

  // Cálculo del Net Salary
  useEffect(() => {
    if (!newSalary || !salaryData.isSalaried) return

    const salary = parseFloat(newSalary) || 0
    const taxRate = parseFloat(taxes) || 0
    const vtoMin = parseFloat(VTO) || 0
    const otMin = parseFloat(OT) || 0

    if (taxRate > 100 || taxRate < 0) {
      alert("Please input valid taxes")
      updateField('taxes', 0)
      return
    }
    if (vtoMin < 0) {
      alert("Please input valid VTO minutes")
      updateField('vto', 0)
      return
    }
    if (otMin < 0) {
      alert("Please input valid OT minutes")
      updateField('ot', 0)
      return
    }

    const minutePay = salary / 15 / 6 / 60
    const vtoDeduction = minutePay * vtoMin
    const otAddition = minutePay * otMin * 1.5 * (1 - taxRate / 100)
    const netSalary = (salary - vtoDeduction + otAddition) - salary * (taxRate / 100)

    const breakdownDetails = []
    const condition1 = otAddition > 0
    const condition2 = vtoDeduction > 0
    const condition3 = taxRate > 0
    if (condition1 || condition2 || condition3) {
      breakdownDetails.push({ label: "Gross Salary", amount: salary })
    }
    if (condition1) {
      breakdownDetails.push({ label: `+ Overtime (${otMin} min)`, amount: otAddition })
    }
    if (condition2) {
      breakdownDetails.push({ label: `- Unpaid Time (${vtoMin} min)`, amount: vtoDeduction })
    }
    if (condition3) {
      breakdownDetails.push({ label: `- Taxes (${taxRate}%)`, amount: salary * (taxRate / 100) })
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
  }, [newSalary, taxes, VTO, OT, salaryData.isSalaried])

  return (
    <Container>
      <IncomeContainer>
        <QS>Are you a salaried person?</QS>
        <Selection
          value={salaried}
          onChange={(e) => updateField('isSalaried', e.target.value === "Yes")}
        >
          {isSalariedOptions.map((one) => (
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
            setDateRange={setDateRange}
          />
          <IncomeContainer>
            <QS>How much is your gross salary?</QS>
            <Input
              type="number"
              min="1"
              placeholder="Salary"
              value={newSalary}
              onChange={(e) => updateField('grossSalary', e.target.value)}
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
              onChange={(e) => updateField('taxes', e.target.value)}
            />
          </IncomeContainer>
          {dateRange[1] !== null && (
            <UndersAndExtras
              VTO={VTO}
              setVTO={(v) => updateField('vto', v)}
              OT={OT}
              setOT={(v) => updateField('ot', v)}
            />
          )}
        </>
      )}
    </Container>
  )
}

export default IncomeFlow