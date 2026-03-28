import React, { useState, useEffect, use } from "react"
import styled from "styled-components"

const ToastContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  z-index: 1000;
  opacity: ${({ $opacity }) => $opacity};
  transition: opacity 300ms ease-in-out;
`

const Toast = ({ setVisibility, message }) => {
  useEffect(() => {
    const fadeIn = setTimeout(() => {
      setOpacity(1)
    }, 10)
    const fadeOut = setTimeout(() => {
      setOpacity(0)
    }, 3300)
    const unmount = setTimeout(() => {
      setVisibility(false)
    }, 3610)

    return () => {
      clearTimeout(fadeIn)
      clearTimeout(fadeOut)
      clearTimeout(unmount)
    }
  }, [])

  const [opacity, setOpacity] = useState(0)

  return (
    <ToastContainer $opacity={opacity}>
      <p>{message}</p>
    </ToastContainer>
  )
}

export default Toast