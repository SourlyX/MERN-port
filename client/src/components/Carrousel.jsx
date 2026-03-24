import React, { useState, useEffect } from "react"
import Cards from "./Cards"
import styled from "styled-components"

const CarrouselCards = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Button = styled.button`
  background-color: #4DB6AC;
  color: #E0E0E0;
  border: none;
  padding: 10px 16px;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3AA298; /* un turquesa más oscuro */
  }

  &:active {
    transform: scale(0.95);
  }
`

const Carrousel = ({ cards }) => {
  const [actualCard, setActualCard] = useState(0)
  const [fade, setFade] = useState(true)

  const move = (next) => {
    setFade(false) // empieza la transición de salida
    setTimeout(() => {
      if (next) {
        setActualCard(actualCard === cards.length - 1 ? 0 : actualCard + 1)
      } else {
        setActualCard(actualCard === 0 ? cards.length - 1 : actualCard - 1)
      }
      setFade(true) // entra la nueva card
    }, 500) // duración del fade
  }
  
  useEffect(() => {
    const handleKey = (e) => {
      // ejemplo: flechas izquierda y derecha
      if (e.key === "ArrowLeft") move(false)
      if (e.key === "ArrowRight") move(true)
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [actualCard])

  return (
    <div style={{ display:'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button onClick={() => move(false)}>{"<"}</Button>
      <CarrouselCards style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.5s' }}>
        {cards.map((card, index) => (
          index === actualCard ?
          <Cards
            key={index}
            title={card.title}
            description={card.description}
            image={card.image}
            url={card.url}
            inDevelopment={card.inDevelopment}
            fullWidth={true}
          />
          : null
        ))}
      </CarrouselCards>
      <Button onClick={() => move(true)}>{">"}</Button>
    </div>
  )
}


export default Carrousel