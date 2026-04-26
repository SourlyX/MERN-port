import { useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const PeriodSelector = ({ calendarName, selectorName, dateRange, setDateRange, cutDays = [1, 16] }) => {
  const [startDate, endDate] = dateRange
  const [cut1, cut2] = cutDays

  const getQuincenaStart = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    if (day >= cut2) return new Date(year, month, cut2)
    if (day >= cut1) return new Date(year, month, cut1)
    return new Date(year, month - 1, cut2)
  }

  const getQuincenaEnd = (start) => {
    const year = start.getFullYear()
    const month = start.getMonth()
    const day = start.getDate()

    if (day === cut1) return new Date(year, month, cut2 - 1)
    return new Date(year, month + 1, cut1 - 1)
  }

  const getCurrentPeriod = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = getQuincenaStart(today)
    const end = getQuincenaEnd(start)
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
    if (!cutDays || cutDays.length !== 2) return
    const [newStart, newEnd] = getCurrentPeriod()
    setDateRange([newStart, newEnd])
  }, [cutDays[0], cutDays[1]])

  const handleChange = (update) => {
    const [newStart] = update
    if (!newStart) { setDateRange([null, null]); return }
    const normalizedStart = getQuincenaStart(newStart)
    const autoEnd = getQuincenaEnd(normalizedStart)
    setDateRange([normalizedStart, autoEnd])
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