/**
 * DetallesCarro.jsx
 *
 * Componente que representa el carrito de compras desplegable.
 * Muestra la lista de productos agregados al carro, incluyendo imagen,
 * nombre, complementos/guarniciones y un botón para eliminar cada producto.
 * También ofrece botones para vaciar la orden completa o enviarla.
 */

import styled from 'styled-components';

// Contenedor principal del carrito desplegable (posición absoluta, fondo oscuro)
const DetallesContainer = styled.div`
  background-color: #282c34;
  position: absolute;
  margin-top: 30px;
  box-shadow: 1px 5px 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  width: 400px;
  right: 50px;
  z-index: 2;
  font-family: sans-serif;
`;

// Lista desordenada que contiene los productos del carrito
const ListaProductos = styled.ul`
  margin: 0;
  padding: 0;
`;

// Contenedor de los botones de acción (vaciar orden / enviar orden)
const Orden = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-around;
`;

// Botón para enviar la orden (azul con hover más oscuro)
const Enviar = styled.button`
  background-color: #3b82f6;
  height: 50px;
  width: 30%;
  border-radius: 10px;
  color: white;
  font-weight: bold;
  border: none;
  transition: background-color 0.2s ease;
  color: white;

  &:hover {
    background-color: #2563eb;
    cursor: pointer;
  }
`;

// Botón para eliminar/vaciar toda la orden (rojo con hover más oscuro)
const Eliminar = styled.button`
  background-color: #ef4444;
  height: 50px;
  width: 30%;
  border-radius: 10px;
  color: white;
  font-weight: bold;
  border: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #b91c1c;
    cursor: pointer;
  }
`;

// Elemento individual de producto dentro de la lista del carrito
const ProductoItem = styled.li`
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 20px;
  border-bottom: 1px solid #aaa;

  img {
    border-radius: 5px;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  span.complementos {
    font-size: 0.9rem;
    color: #555; /* gris visible para guarniciones/notas */
    margin-right: 5px;
  }

  input[type='image'] {
    cursor: pointer;
  }
`;

/**
 * Componente DetallesCarro
 *
 * @param {Array}    carro          - Lista de productos actualmente en el carrito.
 *                                    Cada elemento es un arreglo donde [0] contiene
 *                                    los datos del producto y [1] sus complementos.
 * @param {Function} removeFromCart - Handler para eliminar un producto individual del carrito.
 * @param {Function} emptyCart      - Handler para vaciar completamente el carrito.
 *
 * @returns {JSX.Element} El panel desplegable del carrito con la lista de productos y acciones.
 */
const DetallesCarro = ({ carro, removeFromCart, emptyCart }) => {
  return (
    <DetallesContainer>
      {/* Lista iterada de productos en el carrito */}
      <ListaProductos>
        {carro.map(item => (
          <ProductoItem key={item[0].numero}>
            {/* Imagen miniatura del producto */}
            <img alt={item[0].name} src={`/${item[0].img}`} width="50" />

            {/* Nombre del producto y sus complementos/guarniciones */}
            <div>
              {item[0].name}
              {item[1].map(complemento => (
                <div key={complemento[0]}>
                  <span className="complementos">{complemento[0]}: </span>
                  {/* Si el complemento es un arreglo, renderiza cada guarnición individualmente */}
                  {Array.isArray(complemento[1])
                    ? complemento[1].map(guarnicion => (
                        <span className="complementos" key={guarnicion}>{guarnicion}</span>
                      ))
                    : <span className="complementos">{complemento[1]}</span>}
                </div>
              ))}
            </div>

            {/* Botón de imagen para eliminar este producto del carrito */}
            <input
              type="image"
              alt="eliminar"
              src="../productos/garbage.png"
              width="30"
              onClick={() => removeFromCart(item)}
            />
          </ProductoItem>
        ))}
      </ListaProductos>

      {/* Botones de acción: solo se muestran si hay productos en el carrito */}
      {(carro.length > 0 &&
        <Orden>
          <Eliminar onClick={() => emptyCart()}>Vaciar orden</Eliminar>
          <Enviar>Enviar orden</Enviar>
        </Orden>)}
    </DetallesContainer>
  );
};

export default DetallesCarro;