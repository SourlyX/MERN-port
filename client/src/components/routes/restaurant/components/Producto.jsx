/**
 * Producto.jsx
 * 
 * Componente que representa un producto individual dentro del catálogo.
 * Muestra la imagen del producto, gestiona su estado visual (disponible/agotado)
 * y controla la apertura de un Popup con opciones de personalización
 * (guarniciones, términos de carne) antes de añadirlo al carrito.
 */

// --- Imports de dependencias y componentes ---
import { useRef } from "react";
import styled from "styled-components";
import Popup from "./Popup";

// --- Styled Components ---

/** Contenedor principal del producto con posición relativa para el popup */
const ProductoContainer = styled.div`
  display: inline-block;
  margin: 10px;
  position: relative;
`;

/** Imagen del producto con efecto hover y estilo "grayout" cuando está agotado */
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

/** Wrapper posicional que centra la etiqueta "Agotado" sobre la imagen */
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

// --- Componente Principal ---

/**
 * Producto
 * 
 * @param {Object}   producto        - Datos del producto (nombre, imagen, cantidad, etc.).
 * @param {Array}    guarniciones    - Lista de guarniciones disponibles.
 * @param {Array}    terminosCarne   - Lista de términos de cocción disponibles.
 * @param {Function} addToCart       - Callback para agregar el producto al carrito.
 * @param {boolean}  isPopupVisible  - Indica si el popup de este producto está visible.
 * @param {Function} onProductoClick - Notifica al componente padre que se hizo clic en el producto.
 * @param {Function} onClosePopup    - Callback para cerrar el popup desde el padre.
 */
const Producto = ({
  producto,
  guarniciones,
  terminosCarne,
  addToCart,
  isPopupVisible,
  onProductoClick,
  onClosePopup
}) => {
  // Referencia al elemento <img> para posicionar el popup respecto a la imagen
  const imgRef = useRef(null);

  // No se requiere estado local (useState) ni función rerenderParent;
  // la visibilidad del popup se controla completamente desde el padre.

  return (
    <ProductoContainer>

      {/* Renderizado condicional: imagen interactiva o imagen "agotado" */}
      {producto.cantidadRestante !== 0 ? (
        // Producto disponible: imagen con handler de clic
        <ProductoImg
          alt={producto.name}
          src={`/${producto.img}`}
          onClick={() => onProductoClick(producto)}
          ref={imgRef}
        />
      ) : (
        // Producto agotado: imagen con estilo "grayout" y etiqueta superpuesta
        <Posicion>
          <ProductoImg
            className="grayout"
            alt={producto.name}
            src={`/${producto.img}`}
          />
          <label>Agotado</label>
        </Posicion>
      )}

      {/* Popup de personalización: se muestra según el estado del padre */}
      {isPopupVisible && (
        <Popup
          producto={producto}
          guarniciones={guarniciones}
          terminosCarne={terminosCarne}
          addToCart={addToCart}
          rerenderParent={onClosePopup}
          originRef={imgRef}
        />
      )}

    </ProductoContainer>
  );
};

export default Producto;