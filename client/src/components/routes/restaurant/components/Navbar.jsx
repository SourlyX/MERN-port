/**
 * Navbar.jsx
 * Componente de barra de navegación principal.
 * Muestra el título de la aplicación y el componente del carrito de compras.
 * Utiliza styled-components para el estilado.
 */

import styled from 'styled-components';
import Carro from './Carro';

/**
 * Contenedor estilizado de la barra de navegación.
 * Usa flexbox para alinear horizontalmente el título y el carrito.
 */
const NavbarWrapper = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100px;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  background-color: #282C34;
  z-index: 10;
  width: 100%;
`;

/**
 * Título estilizado que se muestra en la barra de navegación.
 */
const Title = styled.h1`
  margin: 30px 10px 0px;
  color: rgba(255, 255, 255, 0.7);
  text-align: left;
  align-self: flex-start;
  font-size: 2rem;
`;

/**
 * Componente Navbar
 * Renderiza la barra de navegación con el título y el componente Carro.
 *
 * @param {Array} carro - Lista de productos en el carrito.
 * @param {boolean} esCarroVisible - Indica si el carrito está visible.
 * @param {Function} showCart - Handler para mostrar/ocultar el carrito.
 * @param {Function} removeFromCart - Handler para eliminar un producto del carrito.
 * @param {Function} emptyCart - Handler para vaciar el carrito completamente.
 */
const Navbar = ({ carro, esCarroVisible, showCart, removeFromCart, emptyCart }) => {
  return (
    <NavbarWrapper>
      {/* Título principal de la aplicación */}
      <Title>Menú</Title>

      {/* Componente del carrito de compras con sus props correspondientes */}
      <Carro
        carro={carro}
        esCarroVisible={esCarroVisible}
        showCart={showCart}
        removeFromCart={removeFromCart}
        emptyCart={emptyCart}
      />
    </NavbarWrapper>
  );
};

export default Navbar;