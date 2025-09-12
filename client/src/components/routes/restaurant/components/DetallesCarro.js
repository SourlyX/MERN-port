import styled from 'styled-components'

// Contenedor del carrito desplegable
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
`

const ListaProductos = styled.ul`
  margin: 0;
  padding: 0;
`

const Orden = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-around;
`

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
`

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
`


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
`

const DetallesCarro = ({ carro, removeFromCart, emptyCart }) => {
  return (
    <DetallesContainer>
      <ListaProductos>
        {carro.map(item => (
          <ProductoItem key={item[0].numero}>
            <img alt={item[0].name} src={`${process.env.PUBLIC_URL}/${item[0].img}`} width="50" />
            <div>
              {item[0].name}
              {item[1].map(item => (
                <div key={item[0]}>
                  <span className="complementos">{item[0]}: </span>
                  {Array.isArray(item[1])
                    ? item[1].map(guarnicion => (
                        <span className="complementos" key={guarnicion}>{guarnicion}</span>
                      ))
                    : <span className="complementos">{item[1]}</span>}
                </div>
              ))}
            </div>
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
      {(carro.length > 0 &&
        <Orden>
          <Eliminar onClick={() => emptyCart()}>Vaciar orden</Eliminar>
          <Enviar>Enviar orden</Enviar>
        </Orden>)}
    </DetallesContainer>
  )
}

export default DetallesCarro
