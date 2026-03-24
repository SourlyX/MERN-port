import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const ScrollButton = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  border: none;
  cursor: pointer;
  z-index: 999;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transform: ${({ $show }) => ($show ? 'scale(1)' : 'scale(0.9)')};
  background: none;
  padding: 0;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  &:hover {
    opacity: 0.8;
  }
`

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <ScrollButton onClick={scrollToTop} $show={showButton}>
      <img src="/images/up-arrow.png" alt="Subir" />
    </ScrollButton>
  )
}

export default ScrollToTop
