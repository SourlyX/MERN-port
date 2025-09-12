import { useState } from 'react';
import styled from 'styled-components';
import Producto from './Producto';

const ProductosContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const Productos = ({ productos, guarniciones, terminosCarne, addToCart, setProductos }) => {
  // Estado para saber qué producto está seleccionado (y mostrar su popup)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Función para manejar el clic en un producto, abriendo el popup
  const handleProductoClick = (producto) => {
    setProductoSeleccionado(producto);
  };

  // Función para cerrar el popup
  const handleClosePopup = () => {
    setProductoSeleccionado(null);
  };

  return (
    <ProductosContainer>
      {productos.map((p, index) => (
        <Producto
          key={`${p.name}-${index}`}
          producto={p}
          guarniciones={guarniciones}
          terminosCarne={terminosCarne}
          addToCart={addToCart}
          // Le decimos al hijo si su popup debe ser visible
          isPopupVisible={productoSeleccionado && productoSeleccionado.name === p.name}
          // Le pasamos las funciones para que nos pueda notificar
          onProductoClick={handleProductoClick}
          onClosePopup={handleClosePopup}
        />
      ))}
    </ProductosContainer>
  );
};

export default Productos;