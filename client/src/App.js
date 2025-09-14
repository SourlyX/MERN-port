import React, { useRef, useState }from "react"
import Navbar from "./components/Navbar"
import Container from "./components/projects/Container"
import Footer from "./components/Footer"
import styled from "styled-components"
import About from "./components/routes/About"
import Contact from "./components/Contact"
import PageNotFound from "./components/routes/NotFound"
import LandingPage from "./components/routes/LandingPage"
import ScrollToTop from "./components/ScrollToTop"
import ToDoList from "./components/projects/ToDoList"
import Restarurante from "./components/routes/restaurant/Restaurante"
import Pokedex from "./components/projects/pokeapi/Pokedex"
import Expenses from "./components/projects/expenses/Expenses"
import Login from "./components/routes/Login"
import Register from "./components/routes/Register"
import data from "./data.json"
import "./index.css"
import { HelmetProvider } from "react-helmet-async"
import { Routes, Route } from "react-router-dom"

const MainApp = styled.div`
  color: #E0E0E0;
  background-color: #282C34;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

function App() {

  const contactRef = useRef(null)

  const [income, setIncome] = useState([
    {type: "Net Salary", amount: 0},
    {type: "Total", amount: 0}
  ])

  const [expenses, setExpenses] = useState([
    {type: "Dwelling", amount: 140000},
    {type: "Telephone Bill", amount: 44000},
    {type: "Internet Bill", amount: 29000},
    {type: "Education", amount: 27000},
    {type: "Pablo", amount: 5000},
    {type: "Padre", amount: 5000},
    {type: "Jeremy", amount: 20000},
    {type: "Ernesto", amount: 29000},
    {type: "Total", amount: 213000}
  ])

  const [todos, setTodos] = useState([
    {name: "Something", active: true},
    {name: "Something 2", active: true},
    {name: "buy hotcakes", active: true},
    {name: "Go to the supermarket", active: false},
    {name: "Buy more hotcakes", active: false},
    {name: "Fly like superman", active: false},
    {name: "Buy some eggos", active: true},
  ])
  
  return (
    <MainApp>
      <HelmetProvider>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"/>
      </HelmetProvider>
      <Navbar items={data.navbarItems} contactRef={contactRef} />
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={
          <>
            <LandingPage/>
            {data.techskills && data.techskills.length > 0 && <Container cards={data.techskills} title="Technical Skills" />}
            {data.softSkills && data.softSkills.length > 0 && <Container cards={data.softSkills} title="Soft Skills" />}
          </>
        }/>
        <Route path="/about" element={<About />} />
        <Route path="*"  element={<PageNotFound />} />
        <Route path="/projects/*" element={<Container cards={data.myProjects}  text={"Go to project"} title="Projects"/>} />
        <Route path="/projects/to-do-list" element={<ToDoList todos={todos} setTodos={setTodos}/>}/>
        <Route path="/projects/restaurant" element={<Restarurante/>}/>
        <Route path="/projects/pokedex" element={<Pokedex/>}/>
        <Route path="/projects/gastos" element={<Expenses income={income} setIncome={setIncome} expenses={expenses} setExpenses={setExpenses}/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
      <Contact id="contact" ref={contactRef}/>
      <Footer/>
    </MainApp>
  )
}

export default App

{/*
  Crear twitter de programador
  Proyectos (descripcion, imagen, tecnologias, código)
  Poner pocos proyectos en la pagina de home
  Categorizar habilidades tecnicas (front/back/...)
*/}