import { useRef, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Container from "./components/projects/Container";
import Footer from "./components/Footer";
import About from "./components/routes/About";
import Contact from "./components/Contact";
import PageNotFound from "./components/routes/NotFound";
import LandingPage from "./components/routes/LandingPage";
import ScrollToTop from "./components/ScrollToTop";
import ToDoList from "./components/projects/ToDoList";
import Restarurante from "./components/routes/restaurant/Restaurante";
import Pokedex from "./components/projects/pokeapi/Pokedex";
import PersonalFinance from "./components/projects/PersonalFinance/PersonalFinance";
import Login from "./components/routes/Login";
import Register from "./components/routes/Register";
import data from "./data.json";
import RedirectIfAuth from "./components/routes/RedirectIfAuth";
import Toast from "./components/Toast";
import RouteScrollToTop from "./components/RouteScrollToTop";
import styled from "styled-components";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { Routes, Route, Navigate } from "react-router-dom";

const MainApp = styled.div`
  color: #e0e0e0;
  background-color: #282c34;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

function App() {
  const contactRef = useRef(null);

  const [toastVisibility, setToastVisibility] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  return (
    <AuthProvider>
      <MainApp>
        <HelmetProvider>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        </HelmetProvider>

        <RouteScrollToTop />

        <Navbar
          items={data.navbarItems}
          contactRef={contactRef}
          toastVisibility={setToastVisibility}
          setMessage={setToastMessage}
        />
        <ScrollToTop />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <LandingPage />
                {data.myProjects && (
                  <Container
                    cards={data.myProjects.slice(0, 2)}
                    text="Go to project"
                    title="Main Projects"
                  />
                )}
                {data.techskills?.length > 0 && (
                  <Container cards={data.techskills} title="Technical Skills" />
                )}
                {data.softSkills?.length > 0 && (
                  <Container cards={data.softSkills} title="Soft Skills" />
                )}
              </>
            }
          />

          <Route path="/about" element={<About />} />
          <Route
            path="/projects/*"
            element={
              <Container
                cards={data.myProjects}
                text="Go to project"
                title="Projects"
              />
            }
          />

          <Route path="/projects/to-do-list" element={<ToDoList />} />
          <Route path="/projects/restaurant" element={<Restarurante />} />
          <Route path="/projects/pokedex" element={<Pokedex />} />
          <Route
            path="/projects/personal-finance"
            element={<PersonalFinance />}
          />
          <Route
            path="/personal-finance"
            element={<Navigate to="/projects/personal-finance" replace />}
          />

          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <Login
                  toastVisibility={setToastVisibility}
                  setMessage={setToastMessage}
                />{" "}
              </RedirectIfAuth>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuth>
                <Register
                  toastVisibility={setToastVisibility}
                  setMessage={setToastMessage}
                />
              </RedirectIfAuth>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <Contact
          ref={contactRef}
          toastVisibility={setToastVisibility}
          setMessage={setToastMessage}
        />

        {toastVisibility ? (
          <Toast setVisibility={setToastVisibility} message={toastMessage} />
        ) : null}
        <Footer />
      </MainApp>
    </AuthProvider>
  );
}

export default App;

{
  /*
  Crear twitter de programador
  Proyectos (descripcion, imagen, tecnologias, código)
  Categorizar habilidades tecnicas (front/back/...)
*/
}
