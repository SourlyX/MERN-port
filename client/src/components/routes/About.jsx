import styled from "styled-components"
import Certification from "../Certification"
import TimeLine from "./TimeLine"
import Container from '../projects/Container'
import Carrousel from "../Carrousel"
import ProgressBar from "../ProgressBar"
import data from "../../data.json"

const AboutPageContainer = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: 40px;
  font-size: 28px;
  margin-bottom: 15px;
  padding-bottom: 5px;
  color: #55F5ED;
`

const Grid = styled.section`
  width: 100%;
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
      <Container cards={data.introCards} />
      <SectionTitle>Professional Experience</SectionTitle>
      <TimeLine timestamps={data.ProfessionalExperience} />
      <SectionTitle>Education</SectionTitle>
      <div
        style={{
          borderBottom: "2px solid #55F5ED",
          width: "95%",
          paddingBottom: "30px",
          boxSizing: "border-box"
        }}
      >
        <ul >
          <li>🏫 Bachelor's degree in high school education at "Liceo de Curridabat". 🧠</li>
          <li>🎓 Diploma in Computer Science · UNED · Currently studying. 📜</li>
          <li>📚 I have completed several online courses and certifications in various programming languages and technologies, which can be found bellow. 🖥️</li>
        </ul>
      </div>
      <SectionTitle>Certifications</SectionTitle>
      <div
        style={{
          borderBottom: "2px solid #55F5ED",
          width: "95%",
          paddingBottom: "30px",
          boxSizing: "border-box"
        }}>
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
      </div>
      <SectionTitle>Skills</SectionTitle>
      <div
        style={{
          borderBottom: "2px solid #55F5ED",
          width: "95%",
          paddingBottom: "30px",
          boxSizing: "border-box"
        }}>
        <Grid>
          {data.skills.map(s => (
            <Card key={s.name} aria-label={s.name}>
              <Icon src={s.icon} alt={s.name} />
              <div>
                <strong>{s.title}</strong>
                <div style={{ fontSize: 12, opacity: 0.8, display: 'inline-block' }}>{s.description}</div>
              </div>
            </Card>
          ))}
        </Grid>
      </div>
      <SectionTitle>Interests</SectionTitle>
      <Carrousel cards={data.interestsCards} />
      <SectionTitle>Professional Goals</SectionTitle>
      <TimeLine timestamps={data.ProfessionalGoals} />
      <SectionTitle>Languages</SectionTitle>
      <div
        style={{
          borderBottom: "2px solid #55F5ED",
          width: "95%",
          paddingBottom: "30px",
          boxSizing: "border-box"
        }}>
        {data.Languages.map((language, index) => (
          <ProgressBar
            key={index}
            name={language.name}
            progress={language.progress}
          />
        ))}
      </div>
    </AboutPageContainer>
  )
}

export default AboutPage
