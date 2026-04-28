/**
 * PeriodSelector.jsx
 * Componente selector de período basado en quincenas.
 * Permite al usuario seleccionar un rango de fechas que se ajusta
 * automáticamente a los períodos de corte definidos (por defecto los días 1 y 16).
 * Utiliza react-datepicker para la interfaz de selección de fechas.
 */

import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * Componente PeriodSelector
 * @param {string} calendarName - Título que se muestra sobre el selector.
 * @param {string} selectorName - Texto placeholder del DatePicker.
 * @param {Array} dateRange - Arreglo [startDate, endDate] con el rango actual.
 * @param {Function} setDateRange - Función para actualizar el rango de fechas.
 * @param {Array} cutDays - Días de corte de quincena (por defecto [1, 16]).
 */
const PeriodSelector = ({ calendarName, selectorName, dateRange, setDateRange, cutDays = [1, 16] }) => {
  // Desestructuración del rango de fechas y los días de corte
  const [startDate, endDate] = dateRange;
  const [cut1, cut2] = cutDays;

  /**
   * Calcula la fecha de inicio de la quincena correspondiente a una fecha dada.
   * Determina en qué quincena cae el día y retorna el inicio de ese período.
   */
  const getQuincenaStart = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    if (day >= cut2) return new Date(year, month, cut2);
    if (day >= cut1) return new Date(year, month, cut1);
    // Si el día es menor al primer corte, pertenece a la quincena anterior
    return new Date(year, month - 1, cut2);
  };

  /**
   * Calcula la fecha de fin de la quincena a partir de una fecha de inicio dada.
   * Retorna el último día del período correspondiente.
   */
  const getQuincenaEnd = (start) => {
    const year = start.getFullYear();
    const month = start.getMonth();
    const day = start.getDate();

    if (day === cut1) return new Date(year, month, cut2 - 1);
    return new Date(year, month + 1, cut1 - 1);
  };

  /**
   * Obtiene el período (quincena) actual basado en la fecha de hoy.
   * Retorna un arreglo [inicio, fin] del período vigente.
   */
  const getCurrentPeriod = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = getQuincenaStart(today);
    const end = getQuincenaEnd(start);
    return [start, end];
  };

  // Efecto: valida que la fecha actual esté dentro del rango seleccionado;
  // si no lo está, restablece al período actual.
  useEffect(() => {
    if (!startDate || !endDate) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (today < startDate || today > endDate) {
      const [newStart, newEnd] = getCurrentPeriod();
      setDateRange([newStart, newEnd]);
    }
  }, [startDate, endDate]);

  // Efecto: recalcula el período cuando cambian los días de corte.
  useEffect(() => {
    if (!cutDays || cutDays.length !== 2) return;
    const [newStart, newEnd] = getCurrentPeriod();
    setDateRange([newStart, newEnd]);
  }, [cutDays[0], cutDays[1]]);

  /**
   * Handler del cambio de fecha en el DatePicker.
   * Normaliza la fecha seleccionada al inicio de su quincena
   * y calcula automáticamente la fecha de fin del período.
   */
  const handleChange = (update) => {
    const [newStart] = update;
    if (!newStart) { setDateRange([null, null]); return; }
    const normalizedStart = getQuincenaStart(newStart);
    const autoEnd = getQuincenaEnd(normalizedStart);
    setDateRange([normalizedStart, autoEnd]);
  };

  // Renderizado: contenedor centrado con título y selector de rango de fechas
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
  );
};

export default PeriodSelector;