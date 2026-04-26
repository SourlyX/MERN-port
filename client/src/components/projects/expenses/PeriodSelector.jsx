import { useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const PeriodSelector = ({ calendarName, selectorName, dateRange, setDateRange }) => {
  const [startDate, endDate] = dateRange

  const getQuincenaEnd = (start) => {
    const year = start.getFullYear()
    const month = start.getMonth()
    const day = start.getDate()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    if (day <= 15) {
      return new Date(year, month, 15)
    } else {
      return new Date(year, month, daysInMonth)
    }
  }

  // Obtener el inicio de quincena según el inicio actual
  const getQuincenaStart = (start) => {
    const day = start.getDate()
    if (day <= 15) {
      return new Date(start.getFullYear(), start.getMonth(), 1)
    } else {
      return new Date(start.getFullYear(), start.getMonth(), 16)
    }
  }

  // Calcular el SIGUIENTE periodo basado en el periodo actual
  const getNextPeriod = (currentStart) => {
    const year = currentStart.getFullYear()
    const month = currentStart.getMonth()
    const day = currentStart.getDate()

    let nextStart
    if (day <= 15) {
      nextStart = new Date(year, month, 16)
    } else {
      nextStart = new Date(year, month + 1, 1)
    }

    const nextEnd = getQuincenaEnd(nextStart)
    return [nextStart, nextEnd]
  }

  const getCurrentPeriod = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = getQuincenaStart(today)
    const end = getQuincenaEnd(today)
    return [start, end]
  }

  useEffect(() => {
    if (!startDate || !endDate) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (today < startDate || today > endDate) {
      const [newStart, newEnd] = getCurrentPeriod()
      setDateRange([newStart, newEnd])
    }
  }, [startDate, endDate])

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
          vto: salaryData.vto,
          ot: salaryData.ot,
          isSalaried: salaryData.isSalaried,
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

  const handleChange = (update) => {
    const [newStart, newEnd] = update

    if (!newStart && !newEnd) {
      setDateRange([null, null])
      return
    }

    if (newStart) {
      const normalizedStart = getQuincenaStart(newStart)
      const autoEnd = getQuincenaEnd(normalizedStart)
      setDateRange([normalizedStart, autoEnd])
      return
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 0 20px 0" }}>
      <h2>{calendarName}</h2>

      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={handleChange}
        isClearable={true}
        dateFormat="dd/MM/yyyy"
        placeholderText={selectorName}
      />
    </div>
  )
}

export default PeriodSelector