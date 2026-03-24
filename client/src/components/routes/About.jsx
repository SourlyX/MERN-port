import React from "react"
import styled from "styled-components"
import Certification from "../Certification"
import TimeLine from "./TimeLine"
import Container from '../projects/Container'
import Carrousel from "../Carrousel"
import ProgressBar from "../ProgressBar"
import data from "../../data.json"

const StyledLink = styled.a`
  color: #007bff;
  text-decoration: underline;
  font-size: 1rem;
  font-weight: normal;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #0056b3;
  }
`

const AboutPageContainer = styled.div`
  padding: 20px;
  height: auto;
  color: #E0E0E0;
`

const Cert = styled.div`
  background-color: #3B3F46;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-radius: 8px;
  padding: 10px;
`

const SectionTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 15px;
  border-bottom: 2px solid #55F5ED;
  padding-bottom: 5px;
  color: #55F5ED;
`

const SectionText = styled.p`
  margin-top: 16px;
  margin-bottom: 5rem;
  line-height: 1.6;
  color: white;
  font-size: 1rem;
  text-align: justify;
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-top: 12px;
  }
`

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  @media (max-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`

const Card = styled.div`
  background: #0f1724;
  padding: 12px;
  border-radius: 10px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 6px 16px rgba(2,6,23,0.25);
`

const Icon = styled.img`
  height: 44px;
  width: auto;
  object-fit: contain;
  border-radius: 8px;
`

const AboutPage = () => {
  return (
    <AboutPageContainer>
      <h1 style={{ fontSize: '3rem' }}>About Me</h1>
      <SectionTitle>Brief Introduction</SectionTitle>
        <Container cards={data.introCards}/>
      <SectionTitle>Professional Experience</SectionTitle>
        <TimeLine timestamps={data.ProfessionalExperience}/>
      <SectionTitle>Education</SectionTitle>
        <ul>
          <li>🏫 Bachelor's degree in high school education at "Liceo de Curridabat". 🧠</li>
          <li>🎓 Diploma in Computer Science · UNED · Currently studying. 📜</li>
          <li>📚 I have completed several online courses and certifications in various programming languages and technologies, which can be found bellow. 🖥️</li>
        </ul>
       <SectionTitle>Certifications</SectionTitle>
       <Cert>
       {data.certificationsData.map((certification, index) => (
         <Certification
           key={index}
           title={certification.title}
           company={certification.company}
           date={certification.date}
           credentialId={certification.credentialId}
           imagePath={certification.imagePath}
           skills={certification.skills}
         />
       ))}</Cert>
       <SectionTitle>Skills</SectionTitle>
        <Grid>
          {data.skills.map(s => (
            <Card key={s.name} aria-label={s.name}>
            <Icon src={s.icon} alt={s.name} />
            <div>
              <strong>{s.title}</strong>
              <div style={{fontSize:12, opacity:0.8, display:'inline-block' }}>{s.description}</div>
            </div>
            </Card>
          ))}
        </Grid>
      <SectionTitle>Interests</SectionTitle>
      <Carrousel cards={data.interestsCards}/>
      <SectionTitle>Professional Goals</SectionTitle>
        <TimeLine timestamps={data.ProfessionalGoals}/>
      <SectionTitle>Languages</SectionTitle>
      {data.Languages.map((language, index) => (
        <ProgressBar
          key={index}
          name={language.name}
          progress={language.progress}
        />
      ))}
   </AboutPageContainer>
  )
}

export default AboutPage
