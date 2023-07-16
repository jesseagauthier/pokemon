const displayPokemon = document.getElementById('displayPokemon');
const caughtCount = document.getElementById('numofPokeleft');
const displayCaughtPokemon = document.getElementById('caughtcontainer');
const pokemon = {};
let pokemonCaught = {};
let caughtPokemonList = [];

const storedPokemonCaught = localStorage.getItem('pokemonCaught');

if (storedPokemonCaught) {
  // Parse the stored JSON string into an object
  pokemonCaught = JSON.parse(storedPokemonCaught);

  // Update the caught count
  caughtCount.textContent = Object.keys(pokemonCaught).length;

  // Display the caught Pokémon
  displayCaughtPokemons();
}

async function fetchData() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=20');
  const json = await response.json();

  for (const pokemonData of json.results) {
    const response = await fetch(pokemonData.url);
    const pokemonDataFull = await response.json();

    const key = pokemonDataFull.id;
    const abilities = getRandomElements(pokemonDataFull.abilities.map(ability => ability.ability.name), 3);
    const moves = getRandomElements(pokemonDataFull.moves.map(moves => moves.move.name), 3);

    pokemon[key] = {
      pokemonId: pokemonDataFull.id,
      pokemonName: pokemonDataFull.name,
      pokemonImage: pokemonDataFull.sprites.other.dream_world.front_default,
      pokemonWeight: pokemonDataFull.weight,
      pokemonAbilities: abilities,
      pokemonMoves: moves,
      pokemonExperience: pokemonDataFull.base_experience,
    };
  }

  displayPokemons();
  console.log("Fetched Pokemon");
  console.log(pokemon);
}

function getRandomElements(arr, maxElements) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, maxElements);
}

fetchData();

function displayPokemons() {
  displayPokemon.innerHTML = ''; // Clear the displayPokemon section

  const pokemonList = Object.values(pokemon).slice(0, 4);

  for (const pokemonData of pokemonList) {
    const { pokemonName, pokemonImage, pokemonId } = pokemonData;

    displayPokemon.insertAdjacentHTML('beforeend', `
      <div class="pokemoncard" id="pokemon${pokemonId}">
        <div class="pokemoncard__container">
          <div class="pokemoncard__contents">
            <h3>${pokemonName}</h3>
            <img class="info" title="Pokemon Information" src="assets/stats.svg">
            <img class="pokemonimg" src="${pokemonImage}" alt="${pokemonName}">
          </div>
        </div>
        <button class="pokemoncard__catchbtn">Catch</button>
      </div>
    `);

    const caughtButton = document.getElementById(`pokemon${pokemonId}`).querySelector('.pokemoncard__catchbtn');
    caughtButton.addEventListener('click', catchPokemon);
  }
}

function catchPokemon() {
  const pokemonCard = this.parentNode;
  const pokemonId = pokemonCard.id.slice(7);
  const pokemonName = pokemon[pokemonId].pokemonName;
  const pokemonImage = pokemon[pokemonId].pokemonImage;

  if (Object.keys(pokemonCaught).length >= 4) {
    return;
  }

  console.log(`You caught ${pokemonName}!`);

  pokemonCaught[pokemonId] = {
    pokemonId,
    pokemonName,
    pokemonImage,
  };

  // Save updated caught Pokémon to local storage
  localStorage.setItem('pokemonCaught', JSON.stringify(pokemonCaught));
  const caughtPokemonCount = Object.keys(pokemonCaught).length;

  caughtCount.textContent = caughtPokemonCount;

  const lastPokemonIndex = caughtPokemonCount - 1;

  // Add the fade-out class to the caught Pokemon card
  pokemonCard.classList.add('fade-out');

  // Remove the caught Pokémon from the display after the animation completes
  setTimeout(() => {
    pokemonCard.parentNode.removeChild(pokemonCard);
  }, 600);

  displayCaughtPokemons(lastPokemonIndex);
}

function displayCaughtPokemons(replaceIndex) {
  caughtPokemonList = Object.values(pokemonCaught);
  displayCaughtPokemon.innerHTML = '';

  for (let i = 0; i < caughtPokemonList.length; i++) {
    const { pokemonName, pokemonImage, pokemonId } = caughtPokemonList[i];

    displayCaughtPokemon.insertAdjacentHTML('beforeend', `
      <div class="pokemoncard caught">
        <div class="pokemoncard__container">
          <div class="pokemoncard__contents">
            <h3>${pokemonName}</h3>
            <img class="info" title="Pokemon Information" src="assets/stats.svg">
            <img class="pokemonimg" src="${pokemonImage}" alt="${pokemonName}">
          </div>
        </div>
        <button id="caughtpokemon${pokemonId}" class="pokemoncard__catchbtn">Release</button>
      </div>
    `);

    const releaseButton = document.getElementById(`caughtpokemon${pokemonId}`);
    releaseButton.addEventListener('click', releasePokemon);
  }
}

function releasePokemon() {
  const pokemonId = this.id.slice(13);
  delete pokemonCaught[pokemonId];

  // Save updated caught Pokémon to local storage
  localStorage.setItem('pokemonCaught', JSON.stringify(pokemonCaught));

  console.log("Released Pokemon: ", pokemonCaught);

  displayCaughtPokemons();
}
