import React, { useEffect, useState } from "react"
import Axios from "axios"
import CardContainer from "./CardContainer"

function Pokedex() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    Axios.get("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0")
      .then(response => {
        setPokemons(response.data.results)
        //console.log(response.data.results)
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      })
  }, [])

  return (
    <CardContainer pokemons={(pokemons)}/>
  )
}

export default Pokedex
