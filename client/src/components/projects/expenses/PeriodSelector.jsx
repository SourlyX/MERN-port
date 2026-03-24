import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const PeriodSelector = ({ calendarName, selectorName, dateRange, setDateRange }) => {
  const [startDate, endDate] = dateRange

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 0 20px 0" }}>
      <h2>{calendarName}</h2>
      
      <DatePicker
        selectsRange={true} // Select range
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update)
        }}
        isClearable={true}
        dateFormat="dd/MM/yyyy"
        placeholderText={selectorName}
        style={{ width: "70%", display: "flex", flexDirection: "column", alignItems: "center" }}
      />

      {/*startDate && endDate && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h4 style={{ margin: '30px 0 0 0'}}>Period selected</h4>
          <p>{startDate.toLocaleDateString('es-CR')} - {endDate.toLocaleDateString('es-CR')}</p>
        </div>
      )*/}
    </div>
  );
}

export default PeriodSelector;