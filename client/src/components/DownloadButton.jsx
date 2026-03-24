import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const GenericButtonButton = styled.button`
  background-color: #55F5ED;
  color: #2C3E50;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #4AE5E0;
  }
`

const Button = ({ url, filePath, text }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (url) {
      navigate(url)
    } else if (filePath) {
      const link = document.createElement('a')
      link.href = filePath
      link.setAttribute('download', '')
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  };

  return (
    <GenericButtonButton onClick={handleClick}>
      {text}
    </GenericButtonButton>
  );
};

export default Button;
