import styled from 'styled-components'
import Carro from './Carro'

const NavbarWrapper = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100px;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  background-color: #282C34;
  z-index: 10;
  width: 100%;
`

const Title = styled.h1`
  margin: 30px 10px 0px;
  color: rgba(255, 255, 255, 0.7);
  text-align: left;
  align-self: flex-start;
  font-size: 2rem;
`

const Navbar = ({ carro, esCarroVisible, showCart, removeFromCart, emptyCart }) => {
  return (
    <NavbarWrapper>
      <Title>Menú</Title>
      <Carro
        carro={carro}
        esCarroVisible={esCarroVisible}
        showCart={showCart}
        removeFromCart={removeFromCart}
        emptyCart={emptyCart}
      />
    </NavbarWrapper>
  )
}

export default Navbar
