document.addEventListener("DOMContentLoaded", function () {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper"); // Wrapper for proper structure
    document.body.appendChild(wrapper);

    let pokemonList = [];

    const urlParams = new URLSearchParams(window.location.search);
    const initialId = parseInt(urlParams.get("id")) || 1;

    fetch("https://pokeapi.co/api/v2/pokemon?limit=489")
        .then(response => response.json())
        .then(data => {
            pokemonList = data.results;
            fetchPokemonDetails(initialId);
        })
        .catch(error => {
            console.error("Error fetching Pokémon list:", error);
            wrapper.textContent = `Failed to load Pokémon list: ${error.message}`;
        });

    function fetchPokemonDetails(id) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(res => res.json())
            .then(pokemonData => {
                return fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
                    .then(res => res.json())
                    .then(speciesData => {
                        pokemonData.flavor_text_entries = speciesData.flavor_text_entries;
                        showPokemon(pokemonData);
                    });
            })
            .catch(error => {
                console.error("Error fetching Pokémon details:", error);
                wrapper.textContent = `Failed to load Pokémon details: ${error.message}`;
            });
    }

    function showPokemon(pokemon) {
        const id = pokemon.id;
        const prevId = id > 1 ? id - 1 : null;
        const nextId = id < pokemonList.length ? id + 1 : null;
        const primaryType = pokemon.types[0]?.type.name.toLowerCase() || 'normal';

        wrapper.innerHTML = `
            <header>
             <a href="index.html"> <i class="fa-solid fa-arrow-left" style ="font-size: x-large; text-decoration:none; color:white"></i></a> <h2 style="padding-right: 6em;">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                    <span class="id">#${id.toString().padStart(3, '0')}</span>
                <img class="logos" src="img/pokeball (2).png" alt="pokeball"> 
            </header>
            <main>
              
                <article data-name="${pokemon.name.toLowerCase()}">
                 <img src="${pokemon.sprites.other['official-artwork'].front_default}" 
                        alt="${pokemon.name}" 
                        onerror="this.src='img/default-pokemon.png';">
                    <p style=" place-self: center;  margin-bottom: 3em; margin-top: -1em; color:white;"> ${pokemon.types.map(type => `<span class="type ${type.type.name.toLowerCase()}">${type.type.name}</span>`).join(" ")}</p>
                    <h3>About</h3>
                   
                    <div class="stats-row">
                    <div class="stats">   
                      <div class="statss"> 
                     <img src="img/weight.jpg" alt="weight" style="    TRANSFORM: translatey(-23%);">
                       <span> ${(pokemon.weight / 10).toFixed(1)} kg </span> </div>
                        <p style="color:grey;">Weight</p> 
                      </div>
                            <div class="stats">  
                         <div class="statss">  
                        <img src="img/straighten.png" alt="strength" style="transform: rotate(90deg) translatex(-3px);">
                       <span> ${(pokemon.height / 10).toFixed(1)} m</span>
                    </div>
                       <span style="color:grey;">Height</span>
                        </div>
                       
                        <div class="stats" style="border-right: none">
                        
                      <span class="abilities"> ${pokemon.abilities.map(ability => ability.ability.name).join(",<br> ")} </span>

                        <p style="color:grey;">Moves</p>

                        </div>
                    </div>

                    <p class="description">${pokemon.flavor_text_entries?.find(entry => entry.language.name === "en")?.flavor_text || "No description available."}</p>
                    <h3>Base Stats</h3>
          <ul>
    ${pokemon.stats.map(stat => `
        <li>
            <span style="font-weight: bold; color: var(--progress-color);">
                ${statAbbreviations[stat.stat.name] || stat.stat.name.toUpperCase()}:
            </span> 
            ${stat.base_stat} 
            <progress class="stat-progress" value="${stat.base_stat}" max="100"></progress>
        </li>
    `).join("")}
</ul>



                    <div class="nav-arrow right" id="nextPokemon" ${!nextId ? "style='visibility:hidden'" : ""}>></div>
         <div class="nav-arrow left" id="prevPokemon" ${!prevId ? "style='visibility:hidden'" : ""}><</div>

                </article>
            </main>
        `;

        if (prevId) document.getElementById("prevPokemon").addEventListener("click", () => fetchPokemonDetails(prevId));
        if (nextId) document.getElementById("nextPokemon").addEventListener("click", () => fetchPokemonDetails(nextId));

        updateColors(primaryType);
    }

    function updateColors(primaryType) {
        const typeColors = {
            grass: '#78C850', poison: '#A040A0', fire: '#F08030',
            water: '#6890F0', flying: '#A890F0', bug: '#A8B820',
            normal: '#A8A878', electric: '#F8D030', ground: '#E0C068',
            rock: '#B8A038', psychic: '#F85888', ice: '#98D8D8',
            dragon: '#7038F8', dark: '#705848', fairy: '#EE99AC'
        };
    
        const selectedColor = typeColors[primaryType] || '#A8A878';
    
        // Update background color
        document.body.style.backgroundColor = selectedColor;
    
        // Update progress bar and text colors
        document.documentElement.style.setProperty('--progress-color', selectedColor);
    
        // Update <h3> colors
        document.querySelectorAll("h3").forEach(h3 => {
            h3.style.color = selectedColor;
        });
    
        // Update stat abbreviations colors
        document.querySelectorAll(".stat-progress + span").forEach(stat => {
            stat.style.color = selectedColor;
        });
    }
    
    const statAbbreviations = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SPA",
        "special-defense": "SPD",
        speed: "SPD"
    };
    
}    
);
