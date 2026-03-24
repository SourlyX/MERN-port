import styled from 'styled-components'

// Contenedor principal del layout
const LayoutWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #282C34; /* fondo oscuro del portafolio */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0;
`

// Contenedor interno para centrar contenido y limitar ancho
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Layout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Container>
        {children}
      </Container>
    </LayoutWrapper>
  )
}

export default Layout
