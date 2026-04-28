/**
 * IncomeFlow.jsx
 *
 * Componente principal para gestionar el flujo de ingresos del usuario.
 * Permite indicar si se es asalariado, configurar períodos de nómina,
 * ingresar salario bruto, impuestos, tiempo no remunerado (VTO) y
 * horas extra (OT). Calcula automáticamente el salario neto y actualiza
 * el estado global de ingresos con un desglose detallado.
 */

import { useEffect } from "react";
import PeriodSelector from "./PeriodSelector";
import styled from "styled-components";
import UndersAndExtras from "./UndersAndExtras";

/* ======================== Styled Components ======================== */

/** Contenedor principal del componente, centrado y con ancho completo */
const Container = styled.div`
  width: 100%;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/** Fila de contenido para cada pregunta/input de ingresos */
const IncomeContainer = styled.div`
  width: 95%;
  max-width: 800px;
  margin: 10px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

/** Selector desplegable estilizado */
const Selection = styled.select`
  width: 45%;
  max-width: 150px;
  border-radius: 10px;
`;

/** Texto de pregunta dentro de cada fila */
const QS = styled.p`
  width: 45%;
`;

/** Campo de entrada numérica estilizado */
const Input = styled.input`
  width: 45%;
  max-width: 150px;
  border-radius: 10px;
`;

/* ======================== Componente IncomeFlow ======================== */

/**
 * IncomeFlow - Componente funcional que gestiona la captura y cálculo
 * de ingresos salariales, incluyendo impuestos, VTO y horas extra.
 *
 * @param {Array} income - Estado actual de los ingresos.
 * @param {Function} setIncome - Setter para actualizar los ingresos.
 * @param {Array} dateRange - Rango de fechas del período de nómina.
 * @param {Function} setDateRange - Setter para actualizar el rango de fechas.
 * @param {Object} salaryData - Objeto con los datos salariales del usuario.
 * @param {Function} setSalaryData - Setter para actualizar los datos salariales.
 */
const IncomeFlow = ({ income, setIncome, dateRange, setDateRange, salaryData, setSalaryData }) => {
  // Opciones del desplegable para indicar si el usuario es asalariado
  const isSalariedOptions = ["===Select one===", "Yes", "No"];

  // Bandera booleana derivada del estado de salaryData
  const isSalaried = !!salaryData.isSalaried;

  // Desestructuración de campos relevantes de salaryData
  const newSalary = salaryData.grossSalary;
  const taxes = salaryData.taxes;
  const VTO = salaryData.vto;
  const OT = salaryData.ot;

  /**
   * Actualiza un campo específico dentro del objeto salaryData
   * de forma inmutable.
   * @param {string} field - Nombre del campo a actualizar.
   * @param {*} value - Nuevo valor del campo.
   */
  const updateField = (field, value) => {
    setSalaryData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Efecto que recalcula el salario neto cada vez que cambian
   * el salario bruto, impuestos, VTO, OT o el estado de asalariado.
   * Genera un desglose detallado y actualiza el estado de ingresos.
   */
  useEffect(() => {
    // Si no hay salario o el usuario no es asalariado, no calcular
    if (!newSalary || !isSalaried) return;

    // Parseo seguro de los valores numéricos
    const salary = parseFloat(newSalary) || 0;
    const taxRate = parseFloat(taxes) || 0;
    const vtoMin = parseFloat(VTO) || 0;
    const otMin = parseFloat(OT) || 0;

    // Validación del porcentaje de impuestos
    if (taxRate > 100 || taxRate < 0) {
      alert("Please input valid taxes");
      updateField('taxes', 0);
      return;
    }

    // Validación de minutos de VTO
    if (vtoMin < 0) {
      alert("Please input valid VTO minutes");
      updateField('vto', 0);
      return;
    }

    // Validación de minutos de OT
    if (otMin < 0) {
      alert("Please input valid OT minutes");
      updateField('ot', 0);
      return;
    }

    // Cálculo del pago por minuto (salario quincenal / 6 días / 60 min)
    const minutePay = salary / 15 / 6 / 60;

    // Deducción por tiempo no remunerado
    const vtoDeduction = minutePay * vtoMin;

    // Adición por horas extra (factor 1.5x, después de impuestos)
    const otAddition = minutePay * otMin * 1.5 * (1 - taxRate / 100);

    // Cálculo del salario neto final
    const netSalary = (salary - vtoDeduction + otAddition) - salary * (taxRate / 100);

    // Construcción del desglose detallado
    const breakdownDetails = [];
    const condition1 = otAddition > 0;
    const condition2 = vtoDeduction > 0;
    const condition3 = taxRate > 0;

    if (condition1 || condition2 || condition3) {
      breakdownDetails.push({ label: "Gross Salary", amount: salary });
    }
    if (condition1) {
      breakdownDetails.push({ label: `+ Overtime (${otMin} min)`, amount: otAddition });
    }
    if (condition2) {
      breakdownDetails.push({ label: `- Unpaid Time (${vtoMin} min)`, amount: vtoDeduction });
    }
    if (condition3) {
      breakdownDetails.push({ label: `- Taxes (${taxRate}%)`, amount: salary * (taxRate / 100) });
    }

    // Objeto del salario neto actualizado con su desglose
    const updatedSalary = {
      type: "Net Salary",
      amount: parseFloat(netSalary.toFixed(2)),
      breakDown: breakdownDetails
    };

    // Actualización del estado de ingresos: salario neto + extras + total
    setIncome(prevIncome => {
      const extraIncomes = prevIncome.filter(
        item => item.type !== "Net Salary" && item.type !== "Total"
      );

      const totalAmount = parseFloat(netSalary.toFixed(2)) + extraIncomes.reduce(
        (sum, item) => sum + parseFloat(item.amount), 0
      );

      return [
        updatedSalary,
        ...extraIncomes,
        { type: "Total", amount: parseFloat(totalAmount.toFixed(2)) }
      ];
    });
  }, [newSalary, taxes, VTO, OT, isSalaried]);

  /**
   * Retorna el valor actual del desplegable según el estado de isSalaried.
   * @returns {string} Texto de la opción seleccionada.
   */
  const getDropdownValue = () => {
    if (salaryData.isSalaried === null) return "===Select one===";
    return isSalaried ? "Yes" : "No";
  };

  /* ======================== Renderizado ======================== */
  return (
    <Container>
      {/* Pregunta: ¿Es asalariado? */}
      <IncomeContainer>
        <QS>Are you a salaried person?</QS>
        <Selection
          value={getDropdownValue()}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "Yes") updateField('isSalaried', true);
            else if (val === "No") updateField('isSalaried', false);
          }}
        >
          {isSalariedOptions.map((one) => (
            <option key={one}>{one}</option>
          ))}
        </Selection>
      </IncomeContainer>

      {/* Sección visible solo si el usuario es asalariado */}
      {isSalaried && (
        <>
          {/* Configuración de los días de corte de nómina */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label>Pay periods start on days:</label>
            <input
              type="number"
              min={1}
              max={28}
              value={salaryData.cutDays[0]}
              style={{ width: "50px", height: "35px", borderRadius: "10px", textAlign: "center" }}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setSalaryData(prev => ({ ...prev, cutDays: [val, prev.cutDays[1]] }));
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
                const val = parseInt(e.target.value) || 16;
                setSalaryData(prev => ({ ...prev, cutDays: [prev.cutDays[0], val] }));
              }}
            />
          </div>

          {/* Selector del período de nómina actual */}
          <PeriodSelector
            calendarName={"🗓️ Current Payroll Period"}
            selectorName={"Payroll period"}
            dateRange={dateRange}
            setDateRange={setDateRange}
            cutDays={salaryData.cutDays}
          />

          {/* Input para el salario bruto */}
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

      {/* Sección de impuestos y ajustes (VTO/OT), visible cuando hay salario ingresado */}
      {(newSalary !== "" && isSalaried) && (
        <>
          {/* Input para el porcentaje de impuestos */}
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

          {/* Componente de VTO y OT, visible solo cuando hay rango de fechas completo */}
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
  );
};

export default IncomeFlow;