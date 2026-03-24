import styled from 'styled-components'
import BubbleAlert from './BubbleAlert'
import DetallesCarro from './DetallesCarro'

const CarroContainer = styled.div`
  position: relative;
  display: inline-block;
`

const ButtonWrapper = styled.div`
  display: inline-block;
  position: relative;
  margin: 30px 13\px 0px;
`

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
`

const BubbleWrapper = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 2;
`

const Carro = ({ carro, esCarroVisible, showCart, removeFromCart, emptyCart }) => {
  const cantidad = carro.length

  return (
    <CarroContainer>
      <ButtonWrapper>
        {cantidad !== 0 && (
          <BubbleWrapper>
            <BubbleAlert value={cantidad} />
          </BubbleWrapper>
        )}
        <CarroButton onClick={showCart}>Orden</CarroButton>
      </ButtonWrapper>
      {esCarroVisible && <DetallesCarro carro={carro} removeFromCart={removeFromCart} emptyCart={emptyCart} />}
    </CarroContainer>
  )
}

export default Carro
