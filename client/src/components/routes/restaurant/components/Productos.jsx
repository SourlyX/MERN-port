/**
 * Productos.jsx
 *
 * Componente contenedor que renderiza una lista de productos.
 * Cada producto se muestra mediante el componente <Producto />.
 * Gestiona el estado del producto seleccionado para controlar
 * la visibilidad de un popup con detalles o acciones adicionales.
 */

import { useState } from 'react';
import styled from 'styled-components';
import Producto from './Producto';

/* Contenedor estilizado con Flexbox para distribuir los productos en un grid responsive */
const ProductosContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

/**
 * Componente Productos
 *
 * @param {Array}    productos      - Lista de objetos producto a renderizar.
 * @param {Array}    guarniciones   - Opciones de guarnición disponibles.
 * @param {Array}    terminosCarne  - Opciones de término de cocción para carnes.
 * @param {Function} addToCart      - Callback para agregar un producto al carrito.
 * @param {Function} setProductos   - Setter para actualizar la lista de productos desde el padre.
 */
const Productos = ({ productos, guarniciones, terminosCarne, addToCart, setProductos }) => {

  /* ---- State ---- */

  // Almacena el producto actualmente seleccionado; `null` indica que ningún popup está abierto.
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  /* ---- Handlers ---- */

  // Abre el popup asignando el producto clickeado como seleccionado.
  const handleProductoClick = (producto) => {
    setProductoSeleccionado(producto);
  };

  // Cierra el popup reseteando el estado a `null`.
  const handleClosePopup = () => {
    setProductoSeleccionado(null);
  };

  /* ---- Render ---- */

  return (
    <ProductosContainer>
      {/* Iteración sobre la lista de productos para renderizar cada <Producto /> */}
      {productos.map((p, index) => (
        <Producto
          key={`${p.name}-${index}`}
          producto={p}
          guarniciones={guarniciones}
          terminosCarne={terminosCarne}
          addToCart={addToCart}
          // Determina si el popup de este producto debe mostrarse
          isPopupVisible={productoSeleccionado && productoSeleccionado.name === p.name}
          // Callbacks para abrir y cerrar el popup desde el componente hijo
          onProductoClick={handleProductoClick}
          onClosePopup={handleClosePopup}
        />
      ))}
    </ProductosContainer>
  );
};

export default Productos;