'use strict'

const displayPokemon = document.getElementById('displayPokemon')
const displayCaughtPokemon = document.getElementById('caughtcontainer')
const sort = document.getElementById('sort')
const search = document.getElementById('searchValue')
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
  return fetchedPokemonData
}

sort.addEventListener('change', short)
function short() {
  const sortChoice = sort.value

  if (sortChoice === 'experience') {
    console.log('sorted by XP')
    displayedPokemon.sort((a, b) => a.pokemonExperience - b.pokemonExperience)
    displayPokemons()
  }
  if (sortChoice === 'name') {
    console.log('sorted by name')
    displayedPokemon.sort((a, b) => a.pokemonName.localeCompare(b.pokemonName))
    displayPokemons()
  }
}

search.addEventListener('input', searchQuery)

function searchQuery() {
  const searchTerm = search.value
  const matchingPokemon = displayedPokemon.filter(
    (pokemon) => pokemon.pokemonName === searchTerm
  )
  console.log(matchingPokemon)
}

function displayPokemons() {
  displayPokemon.innerHTML = ''

  for (const pokemon of displayedPokemon) {
    displayPokemon.insertAdjacentHTML(
      'beforeend',
      `
        <div class="pokemoncard uncaught-card" data-xp="${pokemon.pokemonExperience}"id="pokemon${pokemon.pokemonId}">
          <div class="pokemoncard__container">
            <div class="pokemoncard__contents">
              <h3>${pokemon.pokemonName}<br><span class="mx-4">Exp ${pokemon.pokemonExperience}</span></h3>

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
  pokemonId = pokemonId
  if (pokemonCaught.length >= 6) {
    console.log('Ball Limit Reached')
    return
  }
  pokemonCaught.push(
    displayedPokemon.find(
      (pokemon) => pokemon.pokemonId === parseInt(pokemonId)
    )
  )
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
    console.log(caughtCount)
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
              <h3>${pokemon.pokemonName}</h3>
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
    const pokemon = combinedPokemon.find(
      (pokemon) => pokemon.pokemonId === parseInt(pokemonId)
    )

    const pokemonMoves = pokemon.pokemonMoves
      .map((move) => `<li class="text-white">${move.move.name}</li>`)
      .join('')

    const pokemonAbilities = pokemon.pokemonAbilities
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
