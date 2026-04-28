/**
 * Layout.jsx
 *
 * Componente de layout principal de la aplicación (portafolio).
 * Proporciona una estructura base con un fondo oscuro, centrado horizontal
 * y un contenedor interno con ancho máximo limitado.
 * Utiliza styled-components para la definición de estilos.
 */

import styled from 'styled-components';

/**
 * LayoutWrapper
 * Contenedor principal del layout.
 * Ocupa el 100% del ancho y al menos el 100% de la altura del viewport.
 * Aplica un fondo oscuro (#282C34) y centra su contenido horizontalmente.
 */
const LayoutWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #282C34; /* fondo oscuro del portafolio */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0;
`;

/**
 * Container
 * Contenedor interno que limita el ancho máximo del contenido a 1200px.
 * Organiza los elementos hijos en columna con un espaciado (gap) de 20px.
 */
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/**
 * Layout
 * Componente funcional que envuelve el contenido de la aplicación
 * dentro de la estructura de layout (LayoutWrapper > Container).
 *
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Elementos hijos a renderizar dentro del layout.
 * @returns {JSX.Element} Estructura de layout con los hijos renderizados.
 */
const Layout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Container>
        {children}
      </Container>
    </LayoutWrapper>
  );
};

export default Layout;