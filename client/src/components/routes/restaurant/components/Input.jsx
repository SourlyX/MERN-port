/**
 * Input.jsx
 *
 * Componente reutilizable de entrada (input) con etiqueta asociada.
 * Utiliza styled-components para el estilizado.
 * Soporta diferentes tipos de input (checkbox, radio, etc.)
 * y permite controlar su estado mediante props externas.
 */

import styled from 'styled-components';

/**
 * Contenedor estilizado para el input y su label.
 * Dispone los elementos en fila (flex), con separación (gap)
 * y estilos personalizados para el input y la etiqueta.
 */
const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  label {
    color: #E0E0E0;
    font-size: 0.95rem;
    cursor: pointer;
  }
`;

/**
 * Componente funcional Input.
 *
 * @param {Function} onChange - Handler que se ejecuta al cambiar el valor del input.
 * @param {string}   type    - Tipo de input (checkbox, radio, text, etc.).
 * @param {string}   name    - Nombre del input, útil para agrupar (ej. radio buttons).
 * @param {string}   text    - Texto que se muestra como label y se usa como value del input.
 * @param {boolean}  checked - Indica si el input está seleccionado (aplica para checkbox/radio).
 *
 * @returns {JSX.Element} Un input con su etiqueta dentro de un contenedor estilizado.
 */
const Input = ({ onChange, type, name, text, checked }) => {
  return (
    <InputContainer>
      {/* Input controlado: recibe tipo, valor, nombre, estado y handler desde props */}
      <input
        onChange={onChange}
        type={type}
        value={text}
        name={name}
        checked={checked}
      />
      {/* Label descriptiva asociada visualmente al input */}
      <label>{text}</label>
    </InputContainer>
  );
};

export default Input;