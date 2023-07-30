const displayPokemon = document.getElementById('displayPokemon');
const displayCaughtPokemon = document.getElementById('caughtcontainer');
const numofPokeleft = document.getElementById('numofPokeleft');
const reloadButton = document.getElementById('reload');

let caughtCount = 0;
let displayedPokemon = [];
let pokemonCaught;

reloadButton.addEventListener('click', reset);
const loadingElement = document.getElementById('loading');

// Retrieve caught Pokemon data from local storage
pokemonCaught = JSON.parse(localStorage.getItem('caughtPokemon')) || [];
caughtCount = pokemonCaught.length;
numofPokeleft.textContent = caughtCount;

function reset() {
  displayedPokemon = {}
  fetchDataAndUpdatePokemon()
}

async function fetchDataAndUpdatePokemon() {
  const updatedPokemonData = await fetchData();
  let count = Object.keys(displayedPokemon).length;
  while (count < 20) {
    const randomIndex = Math.floor(Math.random() * updatedPokemonData.length);
    const pokemonData = updatedPokemonData.splice(randomIndex, 1)[0];
    displayedPokemon[pokemonData.pokemonId] = pokemonData;
    count++;
  }
  displayPokemons();
  displayCaughtPokemons();
}

async function fetchData() {
  // console.log('Fetching Pokemon');
  loadingElement.style.display = 'flex';
  const randomOffset = Math.floor(Math.random() * 100);
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${randomOffset}`);
  const { results } = await response.json();
  const fetchedPokemonData = [];


  for (const { url } of results) {
    const response = await fetch(url);
    const pokemonDataFull = await response.json();

    const pokemonMoves = pokemonDataFull.moves.slice(0, 3);
    const pokemonAbilities = pokemonDataFull.abilities.slice(0, 3)
    // const disc = pokemonDataFull.flavor_text_entries.indexOf(en)

    const pokemonDataObj = {
      pokemonId: pokemonDataFull.id,
      pokemonName: pokemonDataFull.name,
      pokemonImage: pokemonDataFull.sprites.other.dream_world.front_default,
      pokemonWeight: pokemonDataFull.weight,
      pokemonExperience: pokemonDataFull.base_experience,
      pokemonMoves,
      pokemonAbilities,
    };

    const extraInfo = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonDataObj.pokemonId}/`);
    const extraInfoParsed = await extraInfo.json();

    let englishDescription = '';
    for (const entry of extraInfoParsed.flavor_text_entries) {
      if (entry.language.name === 'en') {
        englishDescription = entry.flavor_text;
        break;
      }
    }

    const disc = englishDescription;
    pokemonDataObj.info = disc;
    fetchedPokemonData.push(pokemonDataObj);
  }

  loadingElement.style.display = 'none';
  return fetchedPokemonData;
}

function displayPokemons() {
  displayPokemon.innerHTML = '';

  for (const pokemonId in displayedPokemon) {
    if (displayedPokemon.hasOwnProperty(pokemonId)) {
      const pokemonData = displayedPokemon[pokemonId];

      displayPokemon.insertAdjacentHTML(
        'beforeend',
        `
        <div class="pokemoncard uncaught-card" id="pokemon${pokemonId}">
          <div class="pokemoncard__container">
            <div class="pokemoncard__contents">
              <h3>${pokemonData.pokemonName}</h3>
              <img class="info" id="ability${pokemonId}" data-pokemon-id="${pokemonId}" title="Pokemon Information" src="assets/stats.svg" alt="infobutton">
              <img class="pokemonimg" src="${pokemonData.pokemonImage}" alt="${pokemonData.pokemonName}" title="${pokemonData.pokemonName}">
              <div class="ability-list hidden"></div>
            </div>
          </div>
          <button id="${pokemonId}" data-source="${pokemonId}" data-pokemonName="${pokemonData.pokemonName}" class="pokemoncard__catchbtn">Catch</button>
        </div>
      `
      );
      const catchBTN = document.getElementById(`${pokemonId}`);
      const abilityFlip = document.getElementById(`ability${pokemonId}`);
      abilityFlip.addEventListener('click', () => displayAbilities(pokemonId));
      catchBTN.addEventListener('click', () => catchPokemon(catchBTN));
    }
  }
}

function displayAbilities(pokemonId) {
  const pokemonImage = document.querySelector(`#pokemon${pokemonId} .pokemonimg`);
  const abilityList = document.querySelector(`#pokemon${pokemonId} .ability-list`);

  if (pokemonImage.style.visibility === 'hidden') {
    pokemonImage.style.visibility = 'visible';
    abilityList.classList.add('hidden');
  } else {
    pokemonImage.style.visibility = 'hidden';
    abilityList.classList.remove('hidden');

    abilityList.innerHTML = `
      <table>
        <tr>
          <th>Abilities:</th>
        </tr>
        <tr>
          ${displayedPokemon[pokemonId].pokemonAbilities
        .map((ability) => `<td>${ability.ability.name}</td>`)
        .join('')}
        </tr>
      </table>
      <table>
        <tr>
          <th>Moves:</th>
        </tr>
        <tr>
          ${displayedPokemon[pokemonId].pokemonMoves
        .map((move) => `<td>${move.move.name}</td>`)
        .join('')}
        </tr>
      </table>
    `;
  }
}

function displayCaughtAbilities(pokemon) {
  console.log(pokemon);
  const pokemonImage = document.querySelector(`#pokemon${pokemon.pokemonId} .pokemonimg`);
  const abilityList = document.querySelector(`#pokemon${pokemon.pokemonId} .ability-list`);

  if (pokemonImage.style.visibility === 'hidden') {
    pokemonImage.style.visibility = 'visible';
    abilityList.classList.add('hidden');
  } else {
    pokemonImage.style.visibility = 'hidden';
    abilityList.classList.remove('hidden');

    abilityList.innerHTML = `
       <p>XP:  ${pokemon.pokemonExperience}</p>
         <div>
         <h6>Abilities</h6>
           <ul>
               ${pokemon.pokemonAbilities
        .map((ability) => `<li>${ability.ability.name}</li>`)
        .join('')}
           </ul>
          </div>
        <div>
        <h6>Moves</h6>
          <ul>
           ${pokemon.pokemonMoves
        .map((move) => `<li>${move.move.name}</li>`)
        .join('')}
          </ul>
        </div>
      <p>${pokemon.info}</p>
    `;
  }
}


function catchPokemon(clickedElement) {
  const pokemonId = clickedElement.id;
  if (pokemonCaught.length >= 6) {
    console.log('Ball Limit Reached');
    return;
  }
  pokemonCaught.push(displayedPokemon[pokemonId]);

  caughtCount++;
  delete displayedPokemon[pokemonId];
  numofPokeleft.textContent = caughtCount;
  localStorage.setItem('caughtPokemon', JSON.stringify(pokemonCaught));
  fetchDataAndUpdatePokemon();
  displayPokemons();
}

function displayCaughtPokemons() {
  caught = JSON.parse(localStorage.getItem('caughtPokemon'));
  displayCaughtPokemon.innerHTML = '';
  for (const pokemon of pokemonCaught) {
    displayCaughtPokemon.insertAdjacentHTML(
      'beforeend',
      `
        <div class="pokemoncard caught" id="pokemon${pokemon.pokemonId}">
          <div class="pokemoncard__container">
            <div class="pokemoncard__contents">
              <h3>${pokemon.pokemonName}</h3>
              <img class="info" title="Pokemon Information" src="assets/stats.svg" alt="infobtn" id="ability${pokemon.pokemonId}" data-pokemon-id="${pokemon.pokemonId}">
              <img class="pokemonimg" src="${pokemon.pokemonImage}" alt="${pokemon.pokemonName}" title="${pokemon.pokemonName}">
              <div class="ability-list hidden"></div>
            </div>
          </div>
          <button id="caughtpokemon${pokemon.pokemonId}" class="pokemoncard__catchbtn release">Release</button>
        </div>
      `
    );

    const releaseButton = document.getElementById(`caughtpokemon${pokemon.pokemonId}`);
    releaseButton.addEventListener('click', () => releasePokemon(pokemon.pokemonId));

    const abilityFlip = document.getElementById(`ability${pokemon.pokemonId}`);
    abilityFlip.addEventListener('click', () => displayCaughtAbilities(pokemon));
  }
}

function releasePokemon(pokemonId) {
  const index = pokemonCaught.findIndex(pokemon => pokemon.pokemonId === pokemonId);
  if (index !== -1) {
    pokemonCaught.splice(index, 1);
    caughtCount--;
    numofPokeleft.textContent = caughtCount;
    localStorage.setItem('caughtPokemon', JSON.stringify(pokemonCaught));
    displayCaughtPokemons()
  }
}

fetchDataAndUpdatePokemon();