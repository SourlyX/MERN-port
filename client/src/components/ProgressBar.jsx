import React from "react"
import styled from "styled-components"

const Container = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  width:100%;
  justify-content: space-between;
`

const Bar = styled.div`
  background: #ddd;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
  width: 95%;
`

const Progress = styled.div`
  background-color: turquoise;
  height: 100%;
  width: ${props => `${props.progress}%`};
  transition: width 0.3s ease;
`

const ProgressBar = ({ name, progress }) => {
  return (
    <Container>
      <p>{name}: </p>
      <Bar><Progress progress={progress}/></Bar>
    </Container>
  )
}

export default ProgressBar