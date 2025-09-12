import styled from 'styled-components'

const StyledButton = styled.button`
  background-color: ${props => props.disabled ? '#ccc' : '#FF6F61'};
  color: ${props => props.disabled ? '#666' : '#fff'};
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#E65A50'};
  }
`

const Button = (props) => {
  return <StyledButton {...props} />
}

export default Button
