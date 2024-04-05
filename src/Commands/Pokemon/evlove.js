const axios = require('axios');
const { canPokemonEvolve } = require('../../Helpers/pokeStats');

module.exports = {
    name: "evolve",
    aliases: ["evo"],
    exp: 0,
    cool: 4,
    react: "✨",
    usage: 'Use :evolve',
    category: "pokemon",
    description: "Evolve your Pokémon if it meets the requirements",
    async execute(client, arg, M) {
        try {
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length === 0) {
                return M.reply("📭 Your Pokémon party is empty!");
            }

            const evolveCandidates = party.filter(pokemon => canPokemonEvolve(pokemon));
            if (evolveCandidates.length === 0) {
                return M.reply("No Pokémon in your party can evolve at the moment.");
            }

            // Assuming only one Pokémon can evolve at a time
            const pokemonToEvolve = evolveCandidates[0];
            
            // Fetch evolution chain data for the current Pokémon species
            const speciesData = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonToEvolve.species.toLowerCase()}`);
            const evolutionChainUrl = speciesData.data?.evolution_chain?.url;

            if (!evolutionChainUrl) {
                return M.reply(`Failed to retrieve evolution data for ${pokemonToEvolve.species}.`);
            }

            const evolutionChainData = await axios.get(evolutionChainUrl);
            const evolutionDetails = evolutionChainData.data?.chain;

            if (!evolutionDetails) {
                return M.reply(`Failed to parse evolution data for ${pokemonToEvolve.species}.`);
            }

            // Traverse the evolution chain to find the next evolution
            let nextEvolution = evolutionDetails;
            while (nextEvolution && nextEvolution.species && nextEvolution.species.name !== pokemonToEvolve.species) {
                nextEvolution = nextEvolution.evolves_to[0];
            }

            if (!nextEvolution || !nextEvolution.evolves_to || !nextEvolution.evolves_to[0] || !nextEvolution.evolves_to[0].species) {
                return M.reply(`No evolution data found for ${pokemonToEvolve.species}.`);
            }

            const evolvedSpecies = nextEvolution.evolves_to[0].species.name;
            const evolvedSpeciesData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evolvedSpecies}`);

            if (!evolvedSpeciesData || !evolvedSpeciesData.data) {
                return M.reply(`Failed to retrieve data for evolved species: ${evolvedSpecies}.`);
            }

            // Update the Pokémon's species and name to the evolved form
            pokemonToEvolve.species = evolvedSpecies;
            pokemonToEvolve.name = evolvedSpeciesData.data?.name;

            await M.reply(`Congratulations! Your ${pokemonToEvolve.name} has evolved into ${evolvedSpecies}! 🎉`);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while trying to evolve your Pokémon."
            });
        }
    }
};
              
