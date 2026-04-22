import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const PeriodSelector = ({ calendarName, selectorName, dateRange, setDateRange }) => {
  const [startDate, endDate] = dateRange

  // Calcular los días esperados del rango según el mes/quincena
  const getQuincenaEnd = (start) => {
    const year = start.getFullYear()
    const month = start.getMonth()
    const day = start.getDate()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    if (day === 1) {
      return new Date(year, month, 15)
    } else if (day === 16) {
      return new Date(year, month, daysInMonth)
    } else {
      const end = new Date(start)
      end.setDate(end.getDate() + 14)
      return end
    }
  }

  const handleChange = (update) => {
    const [newStart, newEnd] = update

    if (!newStart && !newEnd) {
      setDateRange([null, null])
      return
    }

    if (newStart) {
      const autoEnd = getQuincenaEnd(newStart)
      setDateRange([newStart, autoEnd])
      return
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isOutsidePeriod = startDate && endDate && (today < startDate || today > endDate)

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

      {/* SOLO se renderiza si está FUERA del periodo */}
      {isOutsidePeriod && (
        <p style={{ color: '#FF6B6B', marginTop: '10px' }}>
          ⚠️ Current date is outside this period
        </p>
      )}
    </div>
  )
}

export default PeriodSelector