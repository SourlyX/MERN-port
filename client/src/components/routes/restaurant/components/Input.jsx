import styled from 'styled-components'

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  label {
    color: #E0E0E0; /* texto gris claro del portafolio */
    font-size: 0.95rem;
    cursor: pointer;
  }
`

const Input = ({ onChange, type, name, text, checked }) => {
  return (
    <InputContainer>
      <input
        onChange={onChange}
        type={type}
        value={text}
        name={name}
        checked={checked}
      />
      <label>{text}</label>
    </InputContainer>
  )
}

export default Input
