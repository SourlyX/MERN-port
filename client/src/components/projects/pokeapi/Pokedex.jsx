/**
 * Pokedex.jsx
 * Componente principal que obtiene la lista de los primeros 151 Pokémon
 * desde la PokeAPI y los renderiza a través del componente CardContainer.
 */

import { useEffect, useState } from "react";
import Axios from "axios";
import CardContainer from "./CardContainer";

/**
 * Pokedex
 * Componente funcional que gestiona el estado de los Pokémon
 * y realiza la petición a la API al montarse.
 */
function Pokedex() {
  // Estado local para almacenar la lista de Pokémon obtenida de la API
  const [pokemons, setPokemons] = useState([]);

  // Efecto que se ejecuta una sola vez al montar el componente para obtener los datos
  useEffect(() => {
    Axios.get("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0")
      .then((response) => {
        setPokemons(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Renderiza el contenedor de tarjetas pasándole la lista de Pokémon
  return (
    <CardContainer pokemons={pokemons} />
  );
}

export default Pokedex;