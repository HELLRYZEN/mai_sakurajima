const { Sets } = require('@pkmn/sets');
const { Screens } = require('pkmn-screens');

module.exports = {
    name: "party",
    aliases: ["party"],
    exp: 0,
    cool: 4,
    react: "📋",
    category: "pokemon",
    party: 'Use :party',
    description: "View your caught Pokémon in your party",
    async execute(client, arg, M) {
        try {
            const party = await client.DB.get(`${M.sender}_Party`) || [];
            if (party.length === 0) {
                return M.reply("📭 Your Pokémon party is empty!");
            }

            if (!arg) { // If no argument provided, display the party screen
                const teamData = party.map(pokemon => ({
                    name: pokemon.name,
                    hp: pokemon.hp,
                    maxHp: pokemon.maxHp,
                    level: pokemon.level
                }));

                const buffer = await Screens.party({
                    data: teamData.map((s) => Sets.importSet(s)),
                    anim: true,
                });

                let pushname = M.pushName.trim();
                let response = `📋 ${pushname}'s Party:\n`;
                party.forEach((pokemon, index) => {
                    response += `${index + 1}. ${pokemon.name}\nLevel: ${pokemon.level}\n\n`;
                });

                await client.sendMessage(
                    M.from,
                    {
                        video: buffer,
                        caption: response,
                        gifPlayback: true
                    },
                    {
                        quoted: M
                    }
                );
            } else { // If argument is provided, display the summary screen for the selected Pokémon
                const argIndex = parseInt(arg);
                if (!isNaN(argIndex) && argIndex >= 1 && argIndex <= party.length) {
                    const selectedPokemon = party[argIndex];

                    const moves = [];
                    for (const move of selectedPokemon.moves) {
                        moves.push({
                            name: move.name,
                            pp: move.pp,
                            maxPp: move.maxPp,
                            type: move.type
                        });
                    }

                    const summarySet = Sets.importSet(`
                        ${selectedPokemon.name} @ ${selectedPokemon.item}
                        Ability: ${selectedPokemon.ability}
                        Level: ${selectedPokemon.level}
                        ${selectedPokemon.shiny ? 'Shiny: Yes' : 'Shiny: No'}
                        EVs: ${selectedPokemon.evs}
                        Nature: ${selectedPokemon.nature}
                        ${selectedPokemon.moves.map(move => `- ${move.name}`).join('\n')}
                    `);

                    const summaryBuffer = await Screens.moves({ data: summarySet, anim: true });

                    await client.sendMessage(
                        M.from,
                        {
                            video: summaryBuffer,
                            caption: `Summary screen for ${selectedPokemon.name}:`,
                            gifPlayback: true   
                        },
                        {
                            quoted: M
                        }
                    );
                } else {
                    return M.reply("Invalid Pokémon index. Please provide a valid index between 1 and the number of Pokémon in your party.");
                }
            }
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while retrieving your Pokémon party."
            });
        }
    },
};
