import { useRef } from "react";
import styled from "styled-components";
import Popup from "./Popup";

const ProductoContainer = styled.div`
  display: inline-block;
  margin: 10px;
  position: relative;
`;

const ProductoImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
  cursor: pointer;
  display: block;
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover:not(.grayout) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  &.grayout {
    filter: brightness(60%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Posicion = styled.div`
  position: relative;
  display: inline-block;

  label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #E0E0E0;
    font-weight: bold;
    background-color: rgba(0,0,0,0.4);
    padding: 3px 8px;
    border-radius: 5px;
  }
`;

const Producto = ({
  producto,
  guarniciones,
  terminosCarne,
  addToCart,
  isPopupVisible,   // Prop que indica si el popup debe mostrarse
  onProductoClick,  // Función para notificar al padre sobre el clic
  onClosePopup      // Función para que el popup pueda cerrarse
}) => {
  const imgRef = useRef(null);

  // Ya no necesitamos estado local (useState) ni la función rerenderParent

  return (
    <ProductoContainer>
      {producto.cantidadRestante !== 0 ? (
        <ProductoImg
          alt={producto.name}
          src={`${process.env.PUBLIC_URL}/${producto.img}`} // Ruta de imagen corregida
          onClick={() => onProductoClick(producto)} // Notifica al padre
          ref={imgRef}
        />
      ) : (
        <Posicion>
          <ProductoImg 
            className="grayout" 
            alt={producto.name} 
            src={`${process.env.PUBLIC_URL}/${producto.img}`} 
          />
          <label>Agotado</label>
        </Posicion>
      )}

      {/* La visibilidad depende directamente del prop del padre */}
      {isPopupVisible && (
        <Popup
          producto={producto}
          guarniciones={guarniciones}
          terminosCarne={terminosCarne}
          addToCart={addToCart}
          rerenderParent={onClosePopup} // Pasamos la función de cierre del padre
          originRef={imgRef}
        />
      )}
    </ProductoContainer>
  );
};

export default Producto;