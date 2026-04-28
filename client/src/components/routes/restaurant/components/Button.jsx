/**
 * Button.jsx
 * Componente de botón reutilizable estilizado con styled-components.
 * Soporta estado deshabilitado con estilos visuales diferenciados.
 */

import styled from 'styled-components';

/** Botón estilizado con soporte para estado disabled */
const StyledButton = styled.button`
  background-color: ${props => props.disabled ? '#ccc' : '#FF6F61'};
  color: ${props => props.disabled ? '#666' : '#fff'};
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#E65A50'};
  }
`;

/** Componente Button que propaga todas las props al botón estilizado */
const Button = (props) => {
  return <StyledButton {...props} />;
};

export default Button;