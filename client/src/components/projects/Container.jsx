/**
 * Container.jsx
 * Componente contenedor que renderiza una colección de tarjetas (Cards)
 * agrupadas bajo un título. Utiliza styled-components para el diseño
 * responsive y muestra las tarjetas en un layout flexible.
 */

import styled from 'styled-components';
import Cards from '../Cards';

/* Contenedor estilizado para las tarjetas con layout flex y diseño responsive */
const CardContainer = styled.div`
  justify-self: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid #3B3F46;
  width: 90%;
  padding: 20px;
  background-color: #1F1F1F;
  border-radius: 8px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 12px;
    margin: 8px;
  }
`;

/* Título estilizado centrado con color destacado */
const Title = styled.h1`
  justify-self: center;
  width: 100%;
  text-align: center;
  color: #55F5ED;
  margin-bottom: 20px;
  margin-top: 50px;
`;

/**
 * Componente Container
 * Recibe un arreglo de tarjetas (cards), un título (title) y un texto (text),
 * y renderiza cada tarjeta dentro de un contenedor estilizado.
 *
 * @param {Object[]} cards - Lista de objetos con datos de cada tarjeta.
 * @param {string} title - Título de la sección.
 * @param {string} text - Texto adicional pasado a cada tarjeta.
 */
function Container({ cards, title, text }) {
  return (
    <div style={{ borderBottom: "2px solid #55F5ED" }}>
      <Title>{title}</Title>
      <CardContainer>
        {/* Iteración sobre el arreglo de tarjetas para renderizar cada componente Cards */}
        {cards.map((card, index) => (
          <Cards
            key={index}
            title={card.title}
            description={card.description}
            image={card.image}
            url={card.url}
            inDevelopment={card.inDevelopment}
            text={text}
          />
        ))}
      </CardContainer>
    </div>
  );
}

export default Container;