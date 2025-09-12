import styled from 'styled-components'

const Bubble = styled.span`
  background-color: #E9725A; /* rojo cálido para notificación */
  border-radius: 15px;
  color: #fff;
  padding: 2px 10px;
  font-size: 0.9rem;
  min-width: 20px;
  display: inline-block;
  text-align: center;
  z-index: 1;
`

const BubbleAlert = ({ value }) => {
  const getNumber = (n) => {
    if (!n) return ''
    return n > 9 ? '9+' : n
  }

  return <Bubble>{getNumber(value)}</Bubble>
}

export default BubbleAlert
