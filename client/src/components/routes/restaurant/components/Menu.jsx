import styled from "styled-components"

const MenuBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const TipoMenu = styled.button`
  border-radius: 10px;
  margin: 5px;
  font-size: 2rem;
  background-color: #777;
`

const Menu = ({ options, setMenu }) => {
  const setSelection = (tipo) => {
    setMenu(tipo)
  }

  return (
    <MenuBar>
      {options.map(tipo => (
        <TipoMenu onClick={() => setSelection(tipo)} key={tipo}>{tipo}</TipoMenu>
      ))}
    </MenuBar>
  )
}

export default Menu