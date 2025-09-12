import { useState } from "react"
import styled, { keyframes } from "styled-components"
import Input from "./Input"
import Button from "./Button"

// Animación de crecimiento desde el centro
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
`

// Fondo overlay
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
`

// Contenedor del popup
const PopupContainer = styled.div`
  background-color: #37474F; /* fondo oscuro de tu app */
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
`

const NotaInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4DB6AC; /* color turquesa de tu paleta */
    box-shadow: 0 0 5px rgba(77, 182, 172, 0.5);
  }
`

const Popup = ({ producto, guarniciones, terminosCarne, addToCart, rerenderParent }) => {
  const [termino, setTermino] = useState("Medio")
  const [guarnicionState, setGuarnicionState] = useState(new Array(guarniciones.length).fill(false))
  const [nota, setNota] = useState("")

  const validGuarniciones = () => guarnicionState.filter(Boolean).length

  const handleChange = ({ target }) => {
    if (target.name === "termino") setTermino(target.value)
    else if (target.name === "nota") setNota(target.value)
  }

  const handleCheckbox = (position) => {
    const updated = guarnicionState.map((item, index) => index === position ? !item : item)
    setGuarnicionState(updated)
  }

  const submit = (e) => {
    e.preventDefault()
    if (validGuarniciones() === producto.guarniciones) {
      const data = Array.from(new FormData(e.target))
      addToCart(producto, data)
      rerenderParent()
    }
  }

  const canSubmit = validGuarniciones() === producto.guarniciones

  return (
    <Overlay onClick={rerenderParent}>
      <PopupContainer onClick={e => e.stopPropagation()}>
        <img
          className="img"
          alt={producto.name}
          src={`${process.env.PUBLIC_URL}/${producto.img}`}
        />
        <h2>{producto.name}</h2>
        <form onSubmit={submit}>
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

          {validGuarniciones() > producto.guarniciones && (
            <div>
              <span>Por favor no elija más de {producto.guarniciones} guarnicion(es)</span>
            </div>
          )}

          <span>Notas:</span>
          <NotaInput
            key="nota"
            onChange={handleChange}
            type="text"
            name="nota"
            text={nota}
          />

          <div className="final">
            <Button type="button" onClick={rerenderParent}>Cancelar</Button>
            <Button type="submit" disabled={!canSubmit}>
              {canSubmit ? "Enviar" : `Faltan ${producto.guarniciones - validGuarniciones()} guarnición(es)`}
            </Button>
          </div>
        </form>
      </PopupContainer>
    </Overlay>
  )
}

export default Popup
