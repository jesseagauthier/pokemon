'use strict'
const displayPokemon = document.getElementById('displayPokemon')
const displayCaughtPokemon = document.getElementById('caughtcontainer')
const sort = document.getElementById('sort')
const searchBar = document.getElementById('search')
const searchValue = document.getElementById('searchValue')
const caughtPokemonContainer = document.getElementById(
  'caughtPokemon__container'
)
const numofPokeleft = document.getElementById('numofPokeleft')
const reloadButton = document.getElementById('reload')
const listOfPokemon = []

fetchData()

async function fetchData(fetchedPokemon) {
  try {
    // A random number is chosen to fetch Pokemon from the API using offset pages
    const randomOffset = Math.floor(Math.random() * 100)
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${randomOffset}`
    )

    // Check if the response status is not OK and throw an error if needed
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon data')
    }

    const { results } = await response.json()

    // Create an object to store fetched Pokemon names and URLs
    const fetchedPokemon = results.map((pokemon) => ({
      pokemonName: pokemon.name,
      pokemonUrl: pokemon.url,
    }))

    selectPokemonId(fetchedPokemon)

    return fetchedPokemon
  } catch (error) {
    // Handle any errors that occurred during the fetching process
    console.error('An error occurred while fetching Pokemon data:', error)
    throw error // Rethrow the error to propagate it further
  }
}
async function selectPokemonId(fetchedPokemon) {
  let url = ''

  for (const pokemon of fetchedPokemon) {
    url = pokemon.pokemonUrl
    const parts = url.split('/')
    const endId = parts[parts.length - 2]
    const endIdNumber = parseInt(endId)
    pokemon.pokemonId = endIdNumber
  }
  FetchAllPokemonData(fetchedPokemon)
  return fetchedPokemon
}

async function FetchAllPokemonData(fetchedPokemon) {
  for (const pokemon of fetchedPokemon) {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.pokemonId}/`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon data')
      }

      const pokemonData = await response.json()
      const abilities = pokemonData.abilities
        .filter((ability) => !ability.is_hidden)
        .slice(0, 3)
        .map((ability) => ({
          name: ability.ability.name,
          url: ability.ability.url,
        }))

      const moves = pokemonData.moves
        .filter((move) => !move.is_hidden)
        .slice(0, 3)
        .map((move) => ({
          name: move.move.name,
          url: move.move.url,
        }))

      const savingPokemon = {
        id: pokemonData.id,
        name: pokemonData.name,
        xp: pokemonData.base_experience,
        forms: pokemonData.forms[0].name,
        image: pokemonData.sprites.other.dream_world.front_default,
        abilities: abilities,
        moves: moves,
      }
      listOfPokemon.push(savingPokemon)
      displayPokemons(listOfPokemon)
    } catch (error) {
      console.error('An error occurred while fetching Pokemon data:', error)
      // You might want to handle the error or continue the loop even if one fetch fails
    }
  }
}

function displayPokemons(listOfPokemon) {
  displayPokemon.innerHTML = ''
  for (const pokemon of listOfPokemon) {
    const abilityList = pokemon.abilities
      .map((ability) => `<p>${ability.name}</p>`)
      .join('')
    const moveList = pokemon.moves.map((move) => `<p>${move.name}</p>`).join('')

    displayPokemon.insertAdjacentHTML(
      'beforeend',
      `
      <div class="pokemoncard" data-xp="${pokemon.xp}" id="pokemon${pokemon.id}">
        <div class="pokemoncard__inner">
            <h3>${pokemon.name}<br></h3>
            <img class="pokemonimg" src="${pokemon.image}" alt="${pokemon.name}" title="${pokemon.name}">
        </div>
        <div class="abilities bg-yellow-400 text-black w-full">
          <table class="">
            <tr>
              <th class="py-2"><h2 class="text-xl font-semibold">Abilities</h2></th>
              <td class="py-2" colspan="2">${abilityList}</td>
            </tr>
            <tr>
              <th class="py-2"><h2 class="text-xl font-semibold">Moves</h2></th>
              <td class="py-2" colspan="2">${moveList}</td>
            </tr>
            <tr>
              <th class="py-2"><h2 class="text-xl font-semibold">Experience</h2></th>
              <td class="py-2" colspan="2"><h2 class="text-xl">${pokemon.xp}</h2></td>
            </tr>
          </table>
        </div>
        <div class="controls">
          <button id="${pokemon.id}" data-pokemonid="${pokemon.id}" data-pokemonName="${pokemon.name}" class="pokemoncard__catchbtn catch">Catch</button>
        </div>
      </div>
      `
    )
  }
  displayPokemon.addEventListener('click', actions)
}
