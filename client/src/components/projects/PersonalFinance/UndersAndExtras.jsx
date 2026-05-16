/**
 * UndersAndExtras.jsx
 * Componente que permite al usuario ingresar minutos de tiempo libre no pagado (VTO)
 * y horas extras trabajadas (OT) mediante campos de entrada numéricos.
 */

import styled from "styled-components";

/* Contenedor principal de cada sección de ingreso */
const IncomeContainer = styled.div`
  width: 95%;
  max-width: 800px;
  margin: 10px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

/* Etiqueta de texto para cada pregunta */
const QS = styled.p`
  width:45%;
`;

/* Campo de entrada numérico con bordes redondeados */
const Input = styled.input`
  width: 45%;
  max-width: 150px;
  border-radius: 10px;
`;

/**
 * Componente UndersAndExtras
 * Recibe como props los valores y setters de VTO (tiempo libre no pagado) y OT (horas extras).
 * Renderiza dos campos de entrada para que el usuario ingrese los minutos correspondientes.
 */
const UndersAndExtras = ({ VTO, setVTO, OT, setOT }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%", margin: "15px 0 0 0" }}>
      {/* Sección de ingreso de VTO (tiempo libre no pagado) */}
      <IncomeContainer style={{ maxWidth: "50%" }}>
        <QS>Did you take unpaid days/hours? (in minutes)</QS>
        <Input
          type="number"
          min="0"
          max="100"
          placeholder="VTO"
          value={VTO}
          onChange={(e) => setVTO(e.target.value)}
        />
      </IncomeContainer>

      {/* Sección de ingreso de OT (horas extras) */}
      <IncomeContainer style={{ maxWidth: "50%" }}>
        <QS>Did you work overtime? (minutes)</QS>
        <Input
          type="number"
          min="0"
          max="100"
          placeholder="OT"
          value={OT}
          onChange={(e) => setOT(e.target.value)}
        />
      </IncomeContainer>
    </div>
  );
};

export default UndersAndExtras;