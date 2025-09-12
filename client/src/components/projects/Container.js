import React from 'react'
import styled from 'styled-components'
import Cards from '../Cards'

const CardContainer = styled.div`
  justify-self: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
`

const Title = styled.h1`
  justify-self: center;
  width: 100%;
  text-align: center;
  color: #55F5ED;
  margin-bottom: 20px;
  margin-top: 50px;
`

function Container({ cards, title, text }) {
  return (
    <>
      <Title>{title}</Title>
      <CardContainer>
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
    </>
  )
}

export default Container
