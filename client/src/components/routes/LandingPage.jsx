import Button from "../Button"
import React from 'react'
import styled from 'styled-components'

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 1.5rem);
  text-align: center;
  padding: 20px;
  color: #f5f5f5;
  width: 90%;
  border-bottom: 2px solid #55F5ED;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
  }
`

const ButtonContainer = styled.div`
  position: fixed;
  top: calc(1.5rem + 5px);
  right: 10px;
  text-align: right;
  z-index: 999;
`

const ProfileImage = styled.img`
  width: 200px;
  height: auto;
  border-radius: 50%;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
`

const Name = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
  color: #55F5ED;
`

const Role = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #E61C4D;
`

const Introduction = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  line-height: 1.5;
  margin: 0 20px;
`

const LandingPage = () => {
  const fileUrl = "/CV-LuisUrena.pdf"
  const buttonText = "Download CV"

  return (
    <LandingPageContainer>
      <ButtonContainer>
        <Button text={buttonText} filePath={fileUrl} />
      </ButtonContainer>
      <ProfileImage src="/images/Luis.jpg" alt="Luis Ureña Arosemena" />
      <Name>Luis Ureña Arosemena</Name>
      <Role>Full-Stack Developer</Role>
      <Introduction>
        Hi! I'm a full-stack MERN developer passionate about building robust, scalable web apps.
        I specialize in MongoDB, Express, React, and Node.js, delivering clean, efficient code and great user experiences.
      </Introduction>
    </LandingPageContainer>
  )
}

export default LandingPage
