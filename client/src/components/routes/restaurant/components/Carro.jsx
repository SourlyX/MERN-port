/**
 * Carro.jsx
 * Componente que representa el botón del carrito de compras.
 * Muestra una burbuja de alerta con la cantidad de productos
 * y despliega los detalles del carro cuando está visible.
 */

import styled from 'styled-components';
import BubbleAlert from './BubbleAlert';
import DetallesCarro from './DetallesCarro';

/* Contenedor principal del carrito con posición relativa para elementos absolutos internos */
const CarroContainer = styled.div`
  position: relative;
  display: inline-block;
`;

/* Wrapper del botón del carrito con márgenes de separación */
const ButtonWrapper = styled.div`
  display: inline-block;
  position: relative;
  margin: 30px 13px 0px;
`;

/* Botón estilizado del carrito con efecto hover */
const CarroButton = styled.button`
  background-color: #FF6F61;
  color: #fff;
  border: none;
  padding: 15px 20px;
  border-radius: 15px;
  cursor: pointer;
  font-weight: bold;
  position: relative;
  transition: background-color 0.3s;

  &:hover {
    background-color: #E65A50;
  }
`;

/* Wrapper para posicionar la burbuja de alerta sobre el botón */
const BubbleWrapper = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 2;
`;

/**
 * Componente Carro
 * Renderiza el botón "Orden" con una burbuja indicadora de cantidad
 * y, opcionalmente, el panel de detalles del carrito.
 *
 * @param {Array} carro - Lista de productos en el carrito.
 * @param {boolean} esCarroVisible - Indica si el panel de detalles está visible.
 * @param {Function} showCart - Handler para mostrar/ocultar el carrito.
 * @param {Function} removeFromCart - Handler para eliminar un producto del carrito.
 * @param {Function} emptyCart - Handler para vaciar el carrito completo.
 */
const Carro = ({ carro, esCarroVisible, showCart, removeFromCart, emptyCart }) => {
  /* Cantidad total de productos en el carrito */
  const cantidad = carro.length;

  return (
    <CarroContainer>
      <ButtonWrapper>
        {/* Muestra la burbuja de alerta solo si hay productos en el carrito */}
        {cantidad !== 0 && (
          <BubbleWrapper>
            <BubbleAlert value={cantidad} />
          </BubbleWrapper>
        )}
        {/* Botón que alterna la visibilidad del detalle del carrito */}
        <CarroButton onClick={showCart}>Orden</CarroButton>
      </ButtonWrapper>
      {/* Renderiza el panel de detalles del carrito cuando es visible */}
      {esCarroVisible && <DetallesCarro carro={carro} removeFromCart={removeFromCart} emptyCart={emptyCart} />}
    </CarroContainer>
  );
};

export default Carro;