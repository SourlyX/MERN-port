/**
 * Menu.jsx
 * Componente de menú horizontal que renderiza una barra de botones.
 * Cada botón representa una opción del menú y, al hacer clic,
 * notifica al componente padre la opción seleccionada mediante setMenu.
 */

import styled from "styled-components";

/** Contenedor flex horizontal centrado para los botones del menú */
const MenuBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

/** Botón estilizado que representa cada opción del menú */
const TipoMenu = styled.button`
  border-radius: 10px;
  margin: 5px;
  font-size: 2rem;
  background-color: #777;
`;

/**
 * Componente Menu
 * @param {string[]} options - Lista de opciones a mostrar como botones.
 * @param {function} setMenu - Callback que se ejecuta al seleccionar una opción.
 */
const Menu = ({ options, setMenu }) => {

  /** Handler que propaga la opción seleccionada al componente padre */
  const setSelection = (tipo) => {
    setMenu(tipo);
  };

  return (
    <MenuBar>
      {/* Itera sobre las opciones y renderiza un botón por cada una */}
      {options.map(tipo => (
        <TipoMenu onClick={() => setSelection(tipo)} key={tipo}>{tipo}</TipoMenu>
      ))}
    </MenuBar>
  );
};

export default Menu;