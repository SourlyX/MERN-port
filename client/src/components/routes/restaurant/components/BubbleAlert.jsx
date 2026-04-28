/**
 * BubbleAlert.jsx
 * Componente de burbuja de notificación que muestra un número o "9+" si el valor supera 9.
 * Se utiliza para indicar conteos de alertas o notificaciones en la UI.
 */

import styled from 'styled-components';

/** Componente estilizado: burbuja circular con fondo rojo cálido */
const Bubble = styled.span`
  background-color: #E9725A; /* rojo cálido para notificación */
  border-radius: 15px;
  color: #fff;
  padding: 2px 10px;
  font-size: 0.9rem;
  min-width: 20px;
  display: inline-block;
  text-align: center;
  z-index: 1;
`;

/**
 * BubbleAlert
 * Recibe un valor numérico y lo muestra dentro de una burbuja.
 * Si el valor es falsy, muestra vacío; si es mayor a 9, muestra "9+".
 * @param {Object} props
 * @param {number} props.value - Número de notificaciones a mostrar.
 */
const BubbleAlert = ({ value }) => {
  /**
   * getNumber - Formatea el número para mostrar en la burbuja.
   * @param {number} n - Valor numérico a formatear.
   * @returns {string|number} Cadena vacía, "9+" o el número original.
   */
  const getNumber = (n) => {
    if (!n) return '';
    return n > 9 ? '9+' : n;
  };

  return <Bubble>{getNumber(value)}</Bubble>;
};

export default BubbleAlert;