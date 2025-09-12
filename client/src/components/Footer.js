import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #2A2A2A;
  padding: 20px;
  margin-top: 50px;
  text-align: center;
  color: #fff;
  border-top: 2px solid #55F5ED;
`

const Column = styled.div`
  display: inline-block;
  margin: 0 20px;
`

const SocialMediaLink = styled.a`
  display: inline-block;
  margin: 0 10px;
  color: #55F5ED;
  text-decoration: none;
  
  &:hover {
    color: #E61C4D;
  }
`

const SocialMediaLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`

const LogoImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  cursor: pointer;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.1);
  }
`

const Footer = () => {
  const datos = {
    name: 'Luis Ureña Arosemena',
    email: 'luisferuatrabajos@gmail.com',
    phone: '+(506) 6005 7935',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/in/luis-ure%C3%B1a-arosemena-501105211',
      github: 'https://github.com/SourlyX',
      facebook: 'https://www.facebook.com/Luis.Urena.judo/',
      twitter: 'https://twitter.com/SourlySon'
    }
  }

  return (
    <FooterContainer>
      <Column>
        <h3>Contact:</h3>
        <p>Name: {datos.name}</p>
        <p>E-mail: {datos.email}</p>
        <p>Phone: {datos.phone}</p>
      </Column>
      <Column>
        <h3>Social Media:</h3>
        <SocialMediaLinks>
          <SocialMediaLink href={datos.socialMedia.linkedin}><LogoImage src="/images/linkedin.png" alt="LinkedIn" /></SocialMediaLink>
          <SocialMediaLink href={datos.socialMedia.github}><LogoImage src="/images/github.png" alt="Github" /></SocialMediaLink>
          {/* <SocialMediaLink href={datos.socialMedia.facebook}><LogoImage src="/images/facebook.png" alt="Facebook" /></SocialMediaLink> */}
          <SocialMediaLink href={datos.socialMedia.twitter}><LogoImage src="/images/twitter.png" alt="Twitter" /></SocialMediaLink>
        </SocialMediaLinks>
      </Column>
        <div>
          <p>&copy; {new Date().getFullYear()} {datos.name}</p>
        </div>
    </FooterContainer>
  )
}

export default Footer;
