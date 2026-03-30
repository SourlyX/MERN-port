import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const PeriodSelector = ({ calendarName, selectorName, dateRange, setDateRange }) => {
  const [startDate, endDate] = dateRange
  const today = new Date()

  const isWithinPeriod = startDate && endDate && today >= startDate && today <= endDate

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 0 20px 0" }}>
      <h2>{calendarName}</h2>

      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => setDateRange(update)}
        isClearable={true}
        dateFormat="dd/MM/yyyy"
        placeholderText={selectorName}
      />

      {startDate && endDate && (
        <p style={{
          color: isWithinPeriod ? '#6BFFA6' : '#FF6B6B',
          marginTop: '10px'
        }}>
          {isWithinPeriod
            ? '✅ Current date is within this period'
            : '⚠️ Current date is outside this period'}
        </p>
      )}
    </div>
  )
}

export default PeriodSelector