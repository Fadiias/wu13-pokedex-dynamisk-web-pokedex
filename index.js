document.addEventListener("DOMContentLoaded", function () {
    // **Create Header**
    let header = document.createElement("header");

    // **Create Pokédex Brand**
    let pokedexBrand = document.createElement("div");
    pokedexBrand.classList.add("pokedex-brand");

    // Create Pokédex Logo
    let pokedexLogo = document.createElement("img");
    pokedexLogo.src = "img/pokeball.svg";
    pokedexLogo.alt = "Poké Ball Logo";
    pokedexLogo.classList.add("pokedex-logo");
    pokedexBrand.appendChild(pokedexLogo);

    // Create Pokédex Title
    let pokedexTitle = document.createElement("div");
    pokedexTitle.classList.add("pokedex-title");
    pokedexTitle.textContent = "Pokédex";
    pokedexBrand.appendChild(pokedexTitle);

    // **Create Search Bar**
    let searchBar = document.createElement("div");
    searchBar.classList.add("search-bar");

    // Create Search Icon
    let searchIcon = document.createElement("i");
    searchIcon.classList.add("fas", "fa-search");
    searchBar.appendChild(searchIcon);

    // Create Search Input
    let searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search Pokémon...";
    searchBar.appendChild(searchInput);

    // **Create Hashtag Button**
    let hashtagButton = document.createElement("button");
    hashtagButton.classList.add("hashtag-button");
    hashtagButton.textContent = "#";

    // **Append Elements to Header**
    header.appendChild(pokedexBrand);
    header.appendChild(searchBar);
    header.appendChild(hashtagButton);

    // **Create Main Element**
    let main = document.createElement("main");

    // **Append Header and Main to Body**
    document.body.appendChild(header);
    document.body.appendChild(main);

    // **Create Pokelist Section**
    let sectionElm = document.createElement("section");
    sectionElm.classList.add("pokelist");
    main.appendChild(sectionElm);

    // **Store Pokémon Data Globally**
    let pokemonData = [];

    // **Fetch Pokémon Data**
    fetch("https://pokeapi.co/api/v2/pokemon?limit=489")
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
            return response.json();
        })
        .then(data => {
            console.log("Fetched data:", data);
            pokemonData = data.results.map((pokemon, index) => ({
                id: index + 1, // Ensures IDs are correct
                name: pokemon.name,
                url: pokemon.url
            }));

            renderPokemonList(pokemonData);
        })
        .catch(error => console.error("Fetch error:", error));

    // **Function to Render Pokémon List**
    function renderPokemonList(pokemonList) {
        sectionElm.innerHTML = ""; // Clear previous list

        let divElm = document.createElement("div");
        divElm.innerHTML = pokemonList
            .map(pokemon => {
                let id = pokemon.id;
                return `
                    <a href="detail.html?id=${id}">
                        <article data-name="${pokemon.name.toLowerCase()}">
                          <span class="id">#${String(id).padStart(3, "0")}</span>
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" 
                                 alt="${pokemon.name}" 
                                 onerror="this.src='img/default-pokemon.png';">
                            <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                          
                        </article>
                    </a>
                `;
            })
            .join("");

        sectionElm.appendChild(divElm);
    }

    // **Function to Filter Pokémon**
    function filterPokemon(searchTerm) {
        const filteredPokemon = pokemonData.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderPokemonList(filteredPokemon);
    }

    // **Event Listener for Search Input**
    searchInput.addEventListener("input", function () {
        filterPokemon(this.value);
    });
});


// Code from the second ACTION block:
document.addEventListener('DOMContentLoaded', (event) => {
  // The DOM is fully loaded and parsed

  const element2 = document.querySelector('section.pokelist');
  if (element2) {
    // If an element exists, then continue
    const scrollData = {
      scrollTop: window.scrollY,
      elementOffsetTop: element2.offsetTop,
      windowHeight: window.innerHeight,
      elementHeight: element2.offsetHeight,
      scrollBottom: window.scrollY + window.innerHeight,
    };
    console.log('Scroll Data:', scrollData);
  } else {
    // Handle the case where the element doesn't exist
    console.error('Element section.pokelist not found!');
  }
});