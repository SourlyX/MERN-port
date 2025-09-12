import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageNotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  background-color: #1E1E1E;
  padding: 40px;
  height: 100vh;
`;

const ErrorImage = styled.img`
  max-width: 30%;
  height: auto;
  margin-bottom: 30px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const ErrorMessage = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #55F5ED;
`;

const ErrorDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #E61C4D;
`;

const BackToHomeButton = styled(Link)`
  background-color: #55F5ED;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #E61C4D;
  }
`;

const PageNotFound = () => {
  return (
    <PageNotFoundContainer>
      <ErrorImage src="/images/404.jpeg" alt="Página no encontrada" />
      <ErrorMessage>404 - Page not found</ErrorMessage>
      <ErrorDescription>Sorry, the page you are looking for does not exist.</ErrorDescription>
      <BackToHomeButton to="/">Volver al Inicio</BackToHomeButton>
    </PageNotFoundContainer>
  );
};

export default PageNotFound;
