/**
 * Popup.jsx
 * Componente de popup modal para personalizar un producto antes de agregarlo al carrito.
 * Permite seleccionar término de carne, guarniciones y agregar notas adicionales.
 * Incluye validación de cantidad de guarniciones y animación de aparición.
 */

// --- Imports ---
import { useState } from "react"; // Hook de estado local
import styled, { keyframes } from "styled-components"; // Estilos con styled-components
import Input from "./Input"; // Componente reutilizable de input (radio/checkbox)
import Button from "./Button"; // Componente reutilizable de botón

// --- Styled Components ---

// Animación de crecimiento desde el centro para el popup
const grow = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  80% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`;

// Fondo overlay oscuro que cubre toda la pantalla
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

// Contenedor principal del popup con estilos internos para imagen, título y formulario
const PopupContainer = styled.div`
  background-color: #37474F;
  color: #E0E0E0;
  border-radius: 10px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  animation: ${grow} 0.3s ease-out;
  display: flex;
  flex-direction: column;
  gap: 10px;

  img.img {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
  }

  h2 {
    margin: 10px 0;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .final {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  span {
    font-size: 0.95rem;
  }
`;

// Input estilizado para el campo de notas
const NotaInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4DB6AC;
    box-shadow: 0 0 5px rgba(77, 182, 172, 0.5);
  }
`;

// --- Componente principal ---

/**
 * Popup
 * @param {Object} producto - Producto seleccionado con sus propiedades (name, img, guarniciones, terminoCarne).
 * @param {Array} guarniciones - Lista de guarniciones disponibles.
 * @param {Array} terminosCarne - Lista de términos de carne disponibles.
 * @param {Function} addToCart - Función para agregar el producto configurado al carrito.
 * @param {Function} rerenderParent - Función para cerrar el popup y re-renderizar el componente padre.
 */
const Popup = ({ producto, guarniciones, terminosCarne, addToCart, rerenderParent }) => {

  // --- Hooks de estado ---
  const [termino, setTermino] = useState("Medio"); // Término de carne seleccionado (por defecto "Medio")
  const [guarnicionState, setGuarnicionState] = useState(new Array(guarniciones.length).fill(false)); // Estado booleano de cada guarnición
  const [nota, setNota] = useState(""); // Nota adicional del usuario

  // --- Funciones auxiliares ---

  /** Retorna la cantidad de guarniciones actualmente seleccionadas */
  const validGuarniciones = () => guarnicionState.filter(Boolean).length;

  /**
   * Handler genérico de cambio para inputs controlados.
   * Distingue entre el campo "termino" y el campo "nota".
   */
  const handleChange = ({ target }) => {
    if (target.name === "termino") setTermino(target.value);
    else if (target.name === "nota") setNota(target.value);
  };

  /**
   * Handler para checkboxes de guarniciones.
   * Alterna el valor booleano en la posición indicada.
   * @param {number} position - Índice de la guarnición a alternar.
   */
  const handleCheckbox = (position) => {
    const updated = guarnicionState.map((item, index) => index === position ? !item : item);
    setGuarnicionState(updated);
  };

  /**
   * Handler de envío del formulario.
   * Valida que se hayan seleccionado exactamente las guarniciones requeridas
   * antes de agregar el producto al carrito y cerrar el popup.
   */
  const submit = (e) => {
    e.preventDefault();
    if (validGuarniciones() === producto.guarniciones) {
      const data = Array.from(new FormData(e.target));
      addToCart(producto, data);
      rerenderParent();
    }
  };

  // Determina si el formulario puede enviarse (guarniciones completas)
  const canSubmit = validGuarniciones() === producto.guarniciones;

  // --- Renderizado ---
  return (
    // El click en el overlay cierra el popup
    <Overlay onClick={rerenderParent}>
      {/* Se detiene la propagación para que clicks internos no cierren el popup */}
      <PopupContainer onClick={e => e.stopPropagation()}>

        {/* Imagen del producto */}
        <img
          className="img"
          alt={producto.name}
          src={`/${producto.img}`}
        />

        {/* Nombre del producto */}
        <h2>{producto.name}</h2>

        {/* Formulario de personalización */}
        <form onSubmit={submit}>

          {/* Sección: Término de carne (solo si el producto lo requiere) */}
          {producto.terminoCarne && (
            <>
              <span>Termino de la carne:</span>
              <div className="row">
                {terminosCarne.map(terminoItem => (
                  <Input
                    key={terminoItem}
                    onChange={handleChange}
                    type="radio"
                    name="termino"
                    text={terminoItem}
                    checked={termino === terminoItem}
                  />
                ))}
              </div>
            </>
          )}

          {/* Sección: Guarniciones (solo si el producto tiene guarniciones disponibles) */}
          {producto.guarniciones !== 0 && (
            <>
              <span>Guarnicion(es): {producto.guarniciones}</span>
              <div className="row">
                {guarniciones.map((g, index) => (
                  <Input
                    key={g}
                    onChange={() => handleCheckbox(index)}
                    type="checkbox"
                    name="guarnicion"
                    text={g}
                    checked={guarnicionState[index]}
                  />
                ))}
              </div>
            </>
          )}

          {/* Mensaje de advertencia si se excede el máximo de guarniciones */}
          {validGuarniciones() > producto.guarniciones && (
            <div>
              <span>Por favor no elija más de {producto.guarniciones} guarnicion(es)</span>
            </div>
          )}

          {/* Sección: Nota adicional */}
          <span>Notas:</span>
          <NotaInput
            key="nota"
            onChange={handleChange}
            type="text"
            name="nota"
            text={nota}
          />

          {/* Botones de acción: Cancelar y Enviar */}
          <div className="final">
            <Button type="button" onClick={rerenderParent}>Cancelar</Button>
            <Button type="submit" disabled={!canSubmit}>
              {canSubmit ? "Enviar" : `Faltan ${producto.guarniciones - validGuarniciones()} guarnición(es)`}
            </Button>
          </div>
        </form>
      </PopupContainer>
    </Overlay>
  );
};

export default Popup;