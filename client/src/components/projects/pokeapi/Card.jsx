/**
 * Card.jsx
 * Componente que representa una tarjeta de Pokémon.
 * Muestra el nombre, imagen, número de índice, estadísticas base
 * y calcula los niveles de evolución a partir de la cadena evolutiva.
 */

import styled from "styled-components";

/* ── Styled Components ─────────────────────────────────────────── */

/** Contenedor principal de la tarjeta */
const CardStyled = styled.div`
  width: 20%;
  min-width: 300px;
  height: 400px;
  margin: 10px;
  color: #e0e0e0;
  background-color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/** Sección de estadísticas con fondo radial decorativo */
const Stats = styled.div`
  position: relative;
  border-radius: 15px;
  background-color: #333;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  height: 40%;
  margin-bottom: 3%;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at center, #111, #2c3e50);
    z-index: 2;
    border-radius: 15px;
  }

  > div {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/** Elemento individual de estadística (nombre o valor) */
const StatItem = styled.div`
  z-index: 3;
  height: 10%;
  margin-right: 3px;
  font-size: 14px;
  color: #c5c5c5;
`;

/** Imagen del Pokémon con cursor interactivo */
const Pok = styled.img`
  height: 40%;
  width: auto;
  margin-top: 3%;

  &:hover {
    cursor: pointer;
  }
`;

/* ── Componente Card ───────────────────────────────────────────── */

/**
 * Card – Renderiza la tarjeta de un Pokémon.
 * @param {Object}  pokemon            - Datos del Pokémon (nombre, sprites, stats, etc.).
 * @param {Object}  evolutionChain     - Cadena evolutiva completa del Pokémon.
 * @param {Array}   pokemonEvolutions  - Lista de componentes/evoluciones relacionadas.
 */
function Card({ pokemon, evolutionChain, pokemonEvolutions }) {
  /**
   * Calcula y asigna un nivel numérico a cada evolución
   * recorriendo recursivamente la cadena evolutiva.
   * @returns {Array} Copia de pokemonEvolutions con la propiedad `lvl` asignada.
   */
  const calculateEvolutionsWithLevels = () => {
    // Crea una copia de pokemonEvolutions para asignar niveles
    const evolutionsWithLevels = pokemonEvolutions.map((evolution) => ({
      ...evolution,
      props: {
        ...evolution.props,
        lvl: null, // Inicializa lvl como null
      },
    }));

    /**
     * Recorre la cadena de forma recursiva y asigna el nivel correspondiente.
     * @param {Object} chain - Nodo actual de la cadena evolutiva.
     * @param {number} lvl   - Nivel de evolución (0 = base).
     */
    const assignLevels = (chain, lvl) => {
      const currentName = chain.species.name.toLowerCase();

      // Encuentra el Pokémon coincidente en la lista de evoluciones
      const matchingCard = evolutionsWithLevels.find(
        (evolution) =>
          evolution.props.pokemon.name.toLowerCase() === currentName
      );

      if (matchingCard) {
        matchingCard.props.lvl = lvl; // Asigna el nivel a la tarjeta
      }

      // Si no hay evoluciones adicionales, termina la recursión
      if (!chain.evolves_to || chain.evolves_to.length === 0) {
        return;
      }

      // Incrementa el nivel y procesa las siguientes evoluciones
      chain.evolves_to.forEach((nextChain) =>
        assignLevels(nextChain, lvl + 1)
      );
    };

    // Comienza desde la raíz de la cadena con nivel 0
    assignLevels(evolutionChain.chain, 0);

    return evolutionsWithLevels;
  };

  // Calcula las evoluciones con niveles asignados
  const evolutionsWithLevels = calculateEvolutionsWithLevels();

  /* ── JSX ───────────────────────────────────────────────────── */
  return (
    <CardStyled>
      {/* Nombre del Pokémon con la primera letra en mayúscula */}
      <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>

      {/* Imagen frontal del Pokémon */}
      <Pok src={pokemon.sprites.front_default} alt={pokemon.name}></Pok>

      {/* Número de índice del Pokémon en el juego */}
      <h3>{"#" + pokemon.game_indices[3].game_index}</h3>

      {/* Listado de estadísticas base */}
      <Stats>
        {pokemon.stats.map((stat, index) => (
          <div key={index}>
            <StatItem>{stat.stat.name}:</StatItem>
            <StatItem>{stat.base_stat}</StatItem>
          </div>
        ))}
      </Stats>
    </CardStyled>
  );
}

export default Card;