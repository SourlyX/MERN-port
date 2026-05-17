/**
 * Tables.jsx
 * Componente que muestra tres tablas financieras: Ingresos (Incomes),
 * Gastos (Expenses) y un Resumen Financiero (Financial Overview).
 * Permite eliminar elementos individuales mediante un ícono de papelera.
 */

import { Fragment, useState } from "react";
import styled from "styled-components";

/* ========================
   Styled Components
   ======================== */

/** Contenedor principal que distribuye las tablas en fila (o columna en móvil) */
const TablesContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

/** Contenedor individual para cada tabla */
const TableContainer = styled.div`
  width: 45%;

  @media (max-width: 768px) {
    width: 95%;
  }
`;

/** Tabla estilizada con sombra y bordes redondeados */
const StyledTable = styled.table`
  width: 100%;
  margin: 30px 0px;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

/** Encabezado de tabla con fondo oscuro y texto blanco */
const TableHeader = styled.thead`
  background-color: #333;
  color: white;
  font-size: 1.5em;
`;

/** Fila de tabla con estilos alternados y efecto hover */
const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #383838;
  }
  &:hover {
    background-color: #4c4c4c;
  }
`;

/** Celda de tabla con padding, bordes y texto claro */
const TableCell = styled.td`
  padding: 12px 15px;
  border: 1px solid #444;
  text-align: left;
  color: #f0f0f0;
`;

/** Ícono de papelera para eliminar un registro, con efecto de escala al hover */
const Bin = styled.img`
  height: 30px;
  width: auto;
  cursor: pointer;
  align-self: right;
  transform: scale(1);
  transition: transform 150ms ease-in;

  &:hover {
    transform: scale(1.15);
  }
`;

const Pencil = styled.button`
  height: 30px;
  width: auto;
  cursor: pointer;
  align-self: right;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  padding: 0;
  transform: scale(1);
  transition: transform 150ms ease-in;

  &:hover {
    transform: scale(1.15);
  }
`;

/**
 * Componente Tables
 * @param {Array} income - Lista de objetos de ingresos (incluye tipo, monto y posible desglose).
 * @param {Array} expenses - Lista de objetos de gastos.
 * @param {Function} handleDelete - Callback para eliminar un registro de ingreso o gasto.
 * @param {number} moneyInHand - Dinero disponible en mano.
 * @param {Function} setMoneyInHand - Función para actualizar el dinero disponible en mano.
 * @param {Function} handleEdit - Callback para editar un registro de ingreso o gasto.
 */
const Tables = ({
  income,
  expenses,
  handleDelete,
  moneyInHand,
  setMoneyInHand,
  handleEdit,
}) => {
  const handleConfirm = (table) => {
    handleEdit(table, editingRow, editValues.type, editValues.amount);
    setEditingRow(null);
  };
  const [editingRow, setEditingRow] = useState(null); // Estado para controlar qué fila se está editando
  const [editValues, setEditValues] = useState({ type: "", amount: "" }); // Estado para los valores editados

  return (
    <>
      <TablesContainer>
        {/* ====== Tabla de Ingresos ====== */}
        <TableContainer>
          <h1 style={{ textAlign: "center" }}>Incomes</h1>
          <StyledTable>
            <TableHeader>
              <TableRow>
                <TableCell>Income types</TableCell>
                <TableCell>Amout</TableCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {income.map((target) => {
                /* Caso especial: Net Salary con desglose de partidas */
                if (target.type === "Net Salary" && target.breakDown) {
                  return (
                    <Fragment key={target.type}>
                      <TableRow>
                        <TableCell>
                          <strong>Net Salary</strong>
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          <strong>
                            {"₡" + parseFloat(target.amount).toFixed(2)}
                          </strong>
                        </TableCell>
                      </TableRow>

                      {/* Sub-filas del desglose salarial */}
                      {target.breakDown &&
                        target.breakDown.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell
                              style={{ paddingLeft: "30px", color: "#b0bec5" }}
                            >
                              {item.label}
                            </TableCell>
                            <TableCell
                              style={{ textAlign: "right", color: "#b0bec5" }}
                            >
                              {"₡" + parseFloat(item.amount).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </Fragment>
                  );
                }

                /* Fila de total de ingresos (sin botón de eliminar) */
                if (target.type === "Total") {
                  return (
                    <TableRow key={target.type}>
                      <TableCell>
                        <strong>{target.type}</strong>
                      </TableCell>
                      <TableCell style={{ textAlign: "right" }}>
                        <strong>{"₡" + target.amount}</strong>
                      </TableCell>
                    </TableRow>
                  );
                }

                /* Fila genérica de ingreso con opción de eliminar */
                {
                  return editingRow === target.type ? (
                    <TableRow key={target.type}>
                      <TableCell>
                        <input
                          type="text"
                          value={editValues.type}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              type: e.target.value,
                            })
                          }
                          onKeyDown={(e) => e.key === "Enter" && handleConfirm(income)}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          value={editValues.amount}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              amount: Number(e.target.value),
                            })
                          }
                          onKeyDown={(e) => e.key === "Enter" && handleConfirm(income)}
                        />
                        <button
                          onClick={() => handleConfirm(income)}
                          style={{
                            backgroundColor: "#55F5ED",
                            color: "#282C34",
                          }}
                        >
                          ✔
                        </button>
                        <button
                          onClick={() => setEditingRow(null)}
                          style={{
                            backgroundColor: "#55F5ED",
                            color: "#282C34",
                          }}
                        >
                          ✗
                        </button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={target.type}>
                      <TableCell>{target.type}</TableCell>
                      <TableCell
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {"₡" + target.amount}
                        <div style={{ display: "flex", gap: "6px" }}>
                          <Pencil
                            onClick={() => {
                              setEditingRow(target.type);
                              setEditValues({
                                type: target.type,
                                amount: target.amount,
                              });
                            }}
                          >
                            ✏️
                          </Pencil>
                          <Bin
                            src={`/productos/garbage.png`}
                            alt="Garbage Icon"
                            onClick={() => handleDelete(income, target)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </tbody>
          </StyledTable>
        </TableContainer>

        {/* ====== Tabla de Gastos ====== */}
        <TableContainer>
          <h1 style={{ textAlign: "center" }}>Expenses</h1>
          <StyledTable>
            <TableHeader>
              <TableRow>
                <TableCell>Expense types</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {expenses.map((target, index) => (
                <TableRow key={`${target.type}-${target.amount}`}>
                  {editingRow === target.type ? (
                    <>
                      <TableCell>
                        <input
                          type="text"
                          value={editValues.type}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              type: e.target.value,
                            })
                          }
                          onKeyDown={(e) => e.key === "Enter" && handleConfirm(expenses)}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          value={editValues.amount}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              amount: Number(e.target.value),
                            })
                          }
                          onKeyDown={(e) => e.key === "Enter" && handleConfirm(expenses)}
                        />
                        <button
                          onClick={() => handleConfirm(expenses)}
                          style={{
                            backgroundColor: "#55F5ED",
                            color: "#282C34",
                          }}
                        >
                          ✔
                        </button>
                        <button
                          onClick={() => setEditingRow(null)}
                          style={{
                            backgroundColor: "#55F5ED",
                            color: "#282C34",
                          }}
                        >
                          ✗
                        </button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{target.type}</TableCell>
                      <TableCell
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {"₡" + target.amount}
                        {/* Mostrar papelera y lápiz solo si no es Total ni Salary */}
                        {target.type !== "Total" &&
                          target.type !== "Salary" && (
                            <div style={{ display: "flex", gap: "6px" }}>
                              <Pencil
                                onClick={() => {
                                  setEditingRow(target.type);
                                  setEditValues({
                                    type: target.type,
                                    amount: target.amount,
                                  });
                                }}
                              >
                                ✏️
                              </Pencil>
                              <Bin
                                src={`/productos/garbage.png`}
                                alt="Garbage Icon"
                                onClick={() => handleDelete(expenses, target)}
                              />
                            </div>
                          )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      </TablesContainer>

      {/* ====== Tabla de Resumen Financiero ====== */}
      <TableContainer>
        <h1 style={{ textAlign: "center" }}>Financial Overview</h1>
        <StyledTable>
          <TableHeader>
            <TableRow>
              <TableCell>Movements</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHeader>
          <tbody>
            <TableRow>
              <TableCell>Incomes</TableCell>
              <TableCell>{"₡" + income.at(-1).amount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Expenses</TableCell>
              <TableCell>{"₡" + expenses.at(-1).amount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>
                {"₡" +
                  (income.at(-1).amount - expenses.at(-1).amount).toString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Money in Hand</TableCell>
              <TableCell>
                <input
                  type="number"
                  value={moneyInHand}
                  onChange={(e) => setMoneyInHand(Number(e.target.value))}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ color: "white", background: "#4CAF50" }}>
                Real Balance
              </TableCell>
              <TableCell style={{ color: "white", background: "#4CAF50" }}>
                {"₡" +
                  (
                    income.at(-1).amount -
                    expenses.at(-1).amount +
                    moneyInHand
                  ).toString()}
              </TableCell>
            </TableRow>
          </tbody>
        </StyledTable>
      </TableContainer>
    </>
  );
};

export default Tables;
