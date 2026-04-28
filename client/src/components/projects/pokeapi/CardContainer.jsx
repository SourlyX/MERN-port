/**
 * CardContainer.jsx
 * Componente contenedor que recibe una lista de Pokémon, obtiene sus datos detallados
 * y cadenas de evolución desde la PokéAPI, y renderiza tarjetas (Card) para cada uno.
 */

import { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import Axios from "axios";

/** Título estilizado del Pokédex */
const Title = styled.h1`
  margin-top: 40px;
  margin-bottom: 40px;
  color: white;
`;

/** Contenedor flex que organiza las tarjetas de Pokémon */
const Container = styled.div`
  background-color: #1F1F1F;
  display: flex;
  flex-wrap: wrap;
  width: 95%;
  justify-content: center;
`;

/**
 * CardContainer
 * @param {Object} props
 * @param {Array} props.pokemons - Lista de Pokémon con sus URLs (provenientes de la PokéAPI).
 * Obtiene datos detallados, cadenas de evolución y genera las tarjetas correspondientes.
 */
function CardContainer({ pokemons }) {
  // Estado para almacenar los datos detallados de cada Pokémon
  const [detailedPokemons, setDetailedPokemons] = useState([]);
  // Estado para almacenar las cadenas de evolución únicas
  const [evolutionChain, setChain] = useState([]);
  // Estado para almacenar los componentes Card generados
  const [cards, setCards] = useState([]);

  /**
   * Efecto principal: cada vez que cambia la lista de pokemons,
   * obtiene datos detallados, cadenas de evolución y genera las tarjetas.
   */
  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        // Obtener los detalles de todos los Pokémon en paralelo
        const detailedDataPromises = pokemons.map(async (pokemon) => {
          const response = await Axios.get(pokemon.url);
          return { ...response.data };
        });

        const detailedData = await Promise.all(detailedDataPromises);

        // Eliminar duplicados basándose en el game_index y ordenar ascendentemente
        const uniquePokemons = detailedData.filter((pokemon, index, self) => {
          const gameIndex = pokemon.game_indices[3]?.game_index || 0;
          return (
            self.findIndex(p => (p.game_indices[3]?.game_index || 0) === gameIndex) === index
          );
        }).sort((a, b) => {
          const indexA = a.game_indices[3]?.game_index || 0;
          const indexB = b.game_indices[3]?.game_index || 0;
          return indexA - indexB;
        });

        setDetailedPokemons(uniquePokemons);

        // Obtener las cadenas de evolución para cada Pokémon único
        const chainPromises = uniquePokemons.map(async (pokemon) => {
          const speciesResponse = await Axios.get(pokemon.species.url);
          const chainsResponse = await Axios.get(speciesResponse.data.evolution_chain.url);
          return chainsResponse.data;
        });

        const chains = await Promise.all(chainPromises);

        // Filtrar cadenas únicas basándose en el nombre de la especie raíz
        const uniqueChains = chains.filter((chain, index, self) => {
          return self.findIndex(c => c.chain.species.name === chain.chain.species.name) === index;
        });

        setChain(uniqueChains);

        // Generar componentes Card para cada Pokémon con su cadena de evolución
        const pokemonWithCards = uniquePokemons.map(pokemon => {
          const chainData = hasChain(pokemon.name, uniqueChains);

          // Filtrar Pokémon relacionados que pertenecen a la misma cadena evolutiva
          const relatedPokemons = uniquePokemons.filter(p => {
            return isPartOfChain(p.name, chainData);
          });

          // Generar tarjetas para los Pokémon relacionados
          const relatedCards = relatedPokemons.map(p => (
            <Card key={p.id} pokemon={p}/>
          ));

          return (
            <Card key={pokemon.id} pokemon={pokemon} evolutionChain={chainData} pokemonEvolutions={relatedCards} />
          );
        });

        setCards(pokemonWithCards);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchPokemonData();
  }, [pokemons]);

  /**
   * hasChain - Busca y retorna la cadena de evolución a la que pertenece un Pokémon.
   * @param {string} pokemonName - Nombre del Pokémon a buscar.
   * @param {Array} chains - Lista de cadenas de evolución.
   * @returns {Object|null} La cadena encontrada o null si no pertenece a ninguna.
   */
  const hasChain = (pokemonName, chains) => {
    const traverseChain = (currentChain) => {
      if (!currentChain) return null;

      if (currentChain.species?.name === pokemonName) return true;

      // Recorrer todas las evoluciones disponibles en la cadena
      for (const evolution of currentChain.evolves_to) {
        if (traverseChain(evolution)) return true;
      }

      return false;
    };

    for (const chainData of chains) {
      if (traverseChain(chainData.chain)) return chainData;
    }

    return null;
  };

  /**
   * isPartOfChain - Determina si un Pokémon forma parte de una cadena de evolución dada.
   * @param {string} pokemonName - Nombre del Pokémon a verificar.
   * @param {Object} chainData - Objeto de cadena de evolución.
   * @returns {boolean} true si el Pokémon pertenece a la cadena, false en caso contrario.
   */
  const isPartOfChain = (pokemonName, chainData) => {
    if (!chainData || !chainData.chain) return false;

    const traverseChain = (currentChain) => {
      if (!currentChain) return false;
      if (currentChain.species?.name === pokemonName) return true;

      return currentChain.evolves_to.some(evolution => traverseChain(evolution));
    };

    return traverseChain(chainData.chain);
  };

  // Renderizado: título y contenedor con las tarjetas generadas
  return (
    <>
      <Title>Pokedex</Title>
      <Container>
        {cards}
      </Container>
    </>
  );
}

export default CardContainer;