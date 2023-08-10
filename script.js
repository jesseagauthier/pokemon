'use strict'
let pokemon = {}
let pokemonSearchList = []
let matchingPokemon = []
const displayPokemon = document.getElementById('displayPokemon')
const displayCaughtPokemon = document.getElementById('caughtcontainer')
const sort = document.getElementById('sort')
const searchBar = document.getElementById('search')
const searchValue = document.getElementById('searchValue')
let searchActive = Boolean
const caughtPokemonContainer = document.getElementById(
  'caughtPokemon__container'
)
const numofPokeleft = document.getElementById('numofPokeleft')
const reloadButton = document.getElementById('reload')

let caughtCount = 0
let displayedPokemon = []
let pokemonCaught = []

reloadButton.addEventListener('click', reset)

const loadingElement = document.getElementById('loading')

// Retrieve caught Pokemon data from local storage
pokemonCaught = JSON.parse(localStorage.getItem('caughtPokemon')) || []
caughtCount = pokemonCaught.length
numofPokeleft.textContent = caughtCount

function reset() {
  displayedPokemon = []
  fetchDataAndUpdatePokemon()
}

async function fetchDataAndUpdatePokemon() {
  const updatedPokemonData = await fetchData()
  let count = displayedPokemon.length
  while (count < 20) {
    const randomIndex = Math.floor(Math.random() * updatedPokemonData.length)
    const pokemonData = updatedPokemonData.splice(randomIndex, 1)[0]
    displayedPokemon.push(pokemonData)
    count++
  }
  displayPokemons()
  displayCaughtPokemons()
}

async function fetchData() {
  loadingElement.style.display = 'flex'

  const randomOffset = Math.floor(Math.random() * 100)
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${randomOffset}`
  )
  const { results } = await response.json()
  const fetchedPokemonData = []

  for (const { url } of results) {
    const response = await fetch(url)
    const pokemonDataFull = await response.json()

    const pokemonMoves = pokemonDataFull.moves.slice(0, 10)
    const pokemonAbilities = pokemonDataFull.abilities.slice(0, 10)

    const pokemonDataObj = {
      pokemonId: pokemonDataFull.id,
      pokemonName: pokemonDataFull.name,
      pokemonImage: pokemonDataFull.sprites.other.dream_world.front_default,
      pokemonWeight: pokemonDataFull.weight,
      pokemonExperience: pokemonDataFull.base_experience,
      pokemonMoves,
      pokemonAbilities,
    }

    const extraInfo = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonDataObj.pokemonId}/`
    )
    const extraInfoParsed = await extraInfo.json()

    let englishDescription = ''
    for (const entry of extraInfoParsed.flavor_text_entries) {
      if (entry.language.name === 'en') {
        englishDescription = entry.flavor_text
        break
      }
    }

    pokemonDataObj.info = englishDescription
    fetchedPokemonData.push(pokemonDataObj)
  }

  loadingElement.style.display = 'none'
  searchBar.style.visibility = 'visible'

  return fetchedPokemonData
}

sort.addEventListener('change', sortPokemon)

function sortPokemon() {
  const sortChoice = sort.value
  if (searchActive === false && sortChoice === 'experience') {
    displayedPokemon.sort((b, a) => a.pokemonExperience - b.pokemonExperience)
    displayPokemons()
  }
  if (searchActive === false && sortChoice === 'name') {
    displayedPokemon.sort((a, b) => a.pokemonName.localeCompare(b.pokemonName))
    displayPokemons()
  }

  if (searchActive === true && sortChoice === 'experience') {
    matchingPokemon.sort((b, a) => a.pokemonExperience - b.pokemonExperience)
    displayMatchedPokemon()
    console.log('Search sort by Xp ')
  }

  if (searchActive === true && sortChoice === 'name') {
    matchingPokemon.sort((a, b) => a.pokemonName.localeCompare(b.pokemonName))
    console.log('Search sort by name ')
  }
}

searchValue.addEventListener('input', searchQuery)

function searchQuery(event) {
  event.preventDefault()
  const searchTerm = searchValue.value.replace(/\s+/g, '').toLowerCase()

  // Search the JSON results for the search term
  matchingPokemon = displayedPokemon.filter((pokemon) => {
    return pokemon.pokemonName.toLowerCase().includes(searchTerm)
  })

  displayPokemon.innerHTML = ''

  if (matchingPokemon.length >= 1) {
    for (const pokemon of matchingPokemon) {
      // Display the matching Pokemon information
      displayPokemon.insertAdjacentHTML(
        'beforeend',
        `
        <div class="pokemoncard uncaught-card" data-xp="${pokemon.pokemonExperience}" id="pokemon${pokemon.pokemonId}">
          <div class="pokemoncard__container">
            <div class="pokemoncard__contents">
              <h3>${pokemon.pokemonName}<br><span class="mx-4 text-xs">Exp ${pokemon.pokemonExperience}</span></h3>
              <img class="pokemonimg" src="${pokemon.pokemonImage}" alt="${pokemon.pokemonName}" title="${pokemon.pokemonName}">
              <div class="ability-list hidden"></div>
            </div>
          </div>
          <div class="controls">
            <img class="info" id="ability${pokemon.pokemonId}" data-pokemon-id="${pokemon.pokemonId}" title="Pokemon Information" src="assets/stats.svg" alt="infobutton">
            <button id="${pokemon.pokemonId}" data-pokemonid="${pokemon.pokemonId}" data-pokemonName="${pokemon.pokemonName}" class="pokemoncard__catchbtn catch">Catch</button>
          </div>
        </div>
      `
      )
    }
  } else {
    console.log('No matching Pokemon found, fetching from API')
    searchActive = true
    // Fetch data from the API
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=1200`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Pokemon not found')
        }
        return response.json()
      })
      .then((foundpokemon) => {
        let pokemonList = foundpokemon.results

        let searchList = pokemonList.filter((pokemon) =>
          pokemon.name.includes(searchTerm)
        )
        searchList.forEach((pokemon) => {
          fetch(pokemon.url)
            .then((response) => {
              if (!response.ok) {
                throw new Error('Pokemon Not Found')
              }
              return response.json()
            })
            .then((foundPokemonData) => {
              if (
                foundPokemonData.sprites.other.dream_world.front_default !==
                null
              ) {
                const pokemonMoves = foundPokemonData.moves.slice(0, 10)
                const pokemonAbilities = foundPokemonData.abilities.slice(0, 10)
                const pokemon = {
                  pokemonId: foundPokemonData.id,
                  pokemonName: foundPokemonData.name,
                  pokemonImage:
                    foundPokemonData.sprites.other.dream_world.front_default,
                  pokemonWeight: foundPokemonData.weight,
                  pokemonExperience: foundPokemonData.base_experience,
                  pokemonAbilities: pokemonAbilities,
                  pokemonMoves: pokemonMoves,
                }
                matchingPokemon.push(pokemon)
                displayMatchedPokemon(matchingPokemon)
              }
            })
            .catch((error) => {
              console.error(error)
            })
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
// Assuming foundPokemonData contains necessary properties like pokemonExperience, pokemonId, etc.

function displayMatchedPokemon(matchingPokemon) {
  displayPokemon.innerHTML = ''

  for (pokemon of matchingPokemon) {
    displayPokemon.insertAdjacentHTML(
      'beforeend',
      `
            <div class="pokemoncard uncaught-card" data-xp="${pokemon.pokemonExperience}" id="pokemon${pokemon.pokemonId}">
              <div class="pokemoncard__container">
                <div class="pokemoncard__contents">
                  <h3>${pokemon.pokemonName}<br><span class="text-sm block">XP: ${pokemon.pokemonExperience}</span></h3>

                  <img class="pokemonimg" src="${pokemon.pokemonImage}" alt="${pokemon.pokemonName}" title="${pokemon.pokemonName}">
                  <div class="ability-list hidden"></div>
                </div>
              </div>
              <div class="controls">
                <img class="info" id="ability${pokemon.pokemonId}" data-pokemon-id="${pokemon.pokemonId}" title="Pokemon Information" src="assets/stats.svg" alt="infobutton">
                <button id="${pokemon.pokemonId}" data-pokemonid="${pokemon.pokemonId}" data-pokemonName="${pokemon.pokemonName}" class="pokemoncard__catchbtn catch">Catch</button>
              </div>
            </div>
            `
    )
  }
}

function displayPokemons() {
  displayPokemon.innerHTML = ''
  searchActive = false
  for (const pokemon of displayedPokemon) {
    displayPokemon.insertAdjacentHTML(
      'beforeend',
      `
        <div class="pokemoncard uncaught-card" data-xp="${pokemon.pokemonExperience}"id="pokemon${pokemon.pokemonId}">
          <div class="pokemoncard__container">
            <div class="pokemoncard__contents">
              <h3>${pokemon.pokemonName}<br><span class="text-sm block">XP: ${pokemon.pokemonExperience}</span></h3>

              <img class="pokemonimg" src="${pokemon.pokemonImage}" alt="${pokemon.pokemonName}" title="${pokemon.pokemonName}">
              <div class="ability-list hidden"></div>
            </div>
          </div>
          <div class="controls">
            <img class="info" id="ability${pokemon.pokemonId}" data-pokemon-id="${pokemon.pokemonId}" title="Pokemon Information" src="assets/stats.svg" alt="infobutton">
            <button id="${pokemon.pokemonId}" data-pokemonid="${pokemon.pokemonId}" data-pokemonName="${pokemon.pokemonName}" class="pokemoncard__catchbtn catch">Catch</button>
          </div>
          </div>
      `
    )
  }
  displayPokemon.addEventListener('click', actions)
}

function actions(e) {
  // If catch button is clicked
  if (e.target.classList.contains('catch')) {
    const pokemonId = e.target.dataset.pokemonid
    catchPokemon(pokemonId)
  }
  // If abilities is clicked
  if (e.target.classList.contains('info')) {
    const pokemonId = e.target.dataset.pokemonId
    Abilities(pokemonId)
  }
  // If release button is clicked
  if (e.target.classList.contains('release')) {
    const pokemonId = e.target.id
    releasePokemon(pokemonId)
  }
}

function catchPokemon(pokemonId) {
  console.log(matchingPokemon)
  if (pokemonCaught.length >= 6) {
    console.log('Ball Limit Reached')
    return
  }

  const foundDisplayedPokemon = displayedPokemon.find(
    (pokemon) => pokemon.pokemonId === parseInt(pokemonId)
  )

  if (foundDisplayedPokemon !== undefined) {
    pokemonCaught.push(foundDisplayedPokemon)
    console.log('Caught:', foundDisplayedPokemon)
  } else {
    const foundSearchedPokemon = matchingPokemon.find(
      (pokemon) => pokemon.pokemonId === parseInt(pokemonId)
    )
    console.log(foundSearchedPokemon)

    if (foundSearchedPokemon !== undefined) {
      pokemonCaught.push(foundSearchedPokemon)
      console.log('Caught (Searched):', foundSearchedPokemon)
    } else {
      console.log('Pokemon Not Found')
      return
    }
  }

  caughtCount++
  displayedPokemon = displayedPokemon.filter(
    (pokemon) => pokemon.pokemonId !== parseInt(pokemonId)
  )

  numofPokeleft.textContent = caughtCount
  localStorage.setItem('caughtPokemon', JSON.stringify(pokemonCaught))
  displayPokemons()
  displayCaughtPokemons()
}

fetchDataAndUpdatePokemon()

function displayCaughtPokemons() {
  if (caughtCount > 0) {
    caughtPokemonContainer.style.display = 'block'
  } else {
    caughtPokemonContainer.style.display = 'none'
  }

  displayCaughtPokemon.innerHTML = ''
  for (const pokemon of pokemonCaught) {
    displayCaughtPokemon.insertAdjacentHTML(
      'beforeend',
      `
        <div class="pokemoncard" id="pokemon${pokemon.pokemonId}">
          <div class="pokemoncard__container">
            <div class="pokemoncard__contents">
              <h3 class="">${pokemon.pokemonName}<span class="text-sm block">XP: ${pokemon.pokemonExperience}</span></h3>
              <img class="pokemonimg" id="pokemon${pokemon.pokemonId}" src="${pokemon.pokemonImage}" alt="${pokemon.pokemonName}" title="${pokemon.pokemonName}">
              <div class="ability-list hidden"></div>
            </div>
          </div>
          <div class="controls">
            <img class="info" title="Pokemon Information" src="assets/stats.svg" alt="infobtn" id="ability${pokemon.pokemonId}" data-pokemon-id="${pokemon.pokemonId}">
            <button id="${pokemon.pokemonId}" class="pokemoncard__catchbtn release">Release</button>
          </div>
        </div>
      `
    )
  }
  displayCaughtPokemon.addEventListener('click', actions)
}

function releasePokemon(pokemonId) {
  const index = pokemonCaught.findIndex(
    (pokemon) => pokemon.pokemonId === pokemonId
  )
  if (index !== 0) {
    pokemonCaught.splice(index, 1)
    caughtCount--
    numofPokeleft.textContent = caughtCount
    localStorage.setItem('caughtPokemon', JSON.stringify(pokemonCaught))
    displayCaughtPokemons()
    displayPokemons()
  }
}

function Abilities(pokemonId) {
  const abilityList = document.querySelector(
    `#pokemon${pokemonId} .ability-list`
  )
  const pokemonImage = document.querySelector(
    `#pokemon${pokemonId} .pokemonimg`
  )

  if (pokemonImage.style.visibility === 'hidden') {
    pokemonImage.style.visibility = 'visible'
    abilityList.classList.add('hidden')
  } else {
    pokemonImage.style.visibility = 'hidden'
    abilityList.classList.remove('hidden')

    const combinedPokemon = displayedPokemon.concat(pokemonCaught)
    let selectedPokemon = combinedPokemon.find(
      (pokemon) => pokemon.pokemonId === parseInt(pokemonId)
    )

    if (selectedPokemon === undefined) {
      selectedPokemon = pokemon
    }

    const pokemonMoves = selectedPokemon.pokemonMoves
      .map((move) => `<li class="text-white">${move.move.name}</li>`)
      .join('')

    const pokemonAbilities = selectedPokemon.pokemonAbilities
      .map((ability) => `<li class="text-white">${ability.ability.name}</li>`)
      .join('')

    abilityList.innerHTML = `
  <div class="grid grid-cols-2 gap-4 mt-4">
    <div>
      <h2 class="text-xl font-semibold text-white mb-2">Abilities:</h2>
      <ul class="list-disc pl-4">
        ${pokemonAbilities}
      </ul>
    </div>
    <div>
      <h2 class="text-xl font-semibold text-white mb-2">Moves:</h2>
      <ul class="list-disc pl-4">
        ${pokemonMoves}
      </ul>
    </div>
  </div>
    `
  }
}
