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

  const isSalaried = !!salaryData.isSalaried

  const newSalary = salaryData.grossSalary
  const taxes = salaryData.taxes
  const VTO = salaryData.vto
  const OT = salaryData.ot

  const updateField = (field, value) => {
    setSalaryData(prev => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    if (!newSalary || !isSalaried) return

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

    const updatedSalary = {
      type: "Net Salary",
      amount: parseFloat(netSalary.toFixed(2)),
      breakDown: breakdownDetails
    }

    setIncome(prevIncome => {
      const extraIncomes = prevIncome.filter(
        item => item.type !== "Net Salary" && item.type !== "Total"
      )

      const totalAmount = parseFloat(netSalary.toFixed(2)) + extraIncomes.reduce(
        (sum, item) => sum + parseFloat(item.amount), 0
      )

      return [
        updatedSalary,
        ...extraIncomes,
        { type: "Total", amount: parseFloat(totalAmount.toFixed(2)) }
      ]
    })
  }, [newSalary, taxes, VTO, OT, isSalaried])

  const getDropdownValue = () => {
    if (salaryData.isSalaried === null) return "===Select one==="
    return isSalaried ? "Yes" : "No"
  }

  return (
    <Container>
      <IncomeContainer>
        <QS>Are you a salaried person?</QS>
        <Selection
          value={getDropdownValue()}
          onChange={(e) => {
            const val = e.target.value
            if (val === "Yes") updateField('isSalaried', true)
            else if (val === "No") updateField('isSalaried', false)
          }}
        >
          {isSalariedOptions.map((one) => (
            <option key={one}>{one}</option>
          ))}
        </Selection>
      </IncomeContainer>

      {isSalaried && (
        <>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label>Pay periods start on days:</label>
            <input
              type="number"
              min={1}
              max={28}
              value={salaryData.cutDays[0]}
              style={{ width: "50px", height: "35px", borderRadius: "10px", textAlign: "center" }}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1
                setSalaryData(prev => ({ ...prev, cutDays: [val, prev.cutDays[1]] }))
              }}
            />
            <span>and</span>
            <input
              type="number"
              min={1}
              max={28}
              value={salaryData.cutDays[1]}
              style={{ width: "50px", height: "35px", borderRadius: "10px", textAlign: "center" }}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 16
                setSalaryData(prev => ({ ...prev, cutDays: [prev.cutDays[0], val] }))
              }}
            />
          </div>
          <PeriodSelector
            calendarName={"🗓️ Current Payroll Period"}
            selectorName={"Payroll period"}
            dateRange={dateRange}
            setDateRange={setDateRange}
            cutDays={salaryData.cutDays}
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

      {(newSalary !== "" && isSalaried) && (
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