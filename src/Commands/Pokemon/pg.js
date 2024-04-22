module.exports = {
    name: "pokemongive",
    aliases: ["pg"],
    exp: 3,
    cool: 5,
    react: "🎁",
    category: "pokemon",
    description: "Give a Pokémon from your party to another user.",
    async execute(client, arg, M) {
        try {
            const sender = M.sender;
            const mentionedUser = M.mentions[0];
            const party = await client.DB.get(`${sender}_Party`) || [];

            if (!mentionedUser) {
                return M.reply("Please mention a user to give the Pokémon to.");
            }

            const targetParty = await client.DB.get(`${mentionedUser}_Party`) || [];

            if (party.length === 0) {
                return M.reply("Your Pokémon party is empty!");
            }

            if (!arg || isNaN(arg[0])) {
                return M.reply("Please provide a valid index of the Pokémon you want to give.");
            }

            const index = parseInt(arg[0]);
            if (index <= 0 || index > party.length) {
                return M.reply("Invalid index. Please provide a valid index within your party range.");
            }

            const pokemonToGive = party[index - 1];

            // Remove the Pokémon from sender's party
            party.splice(index - 1, 1);
            await client.DB.set(`${sender}_Party`, party);

            // Add the Pokémon to the target user's party
            targetParty.push(pokemonToGive);
            await client.DB.set(`${mentionedUser}_Party`, targetParty);

            return M.reply(`You have given ${pokemonToGive.name} to ${mentionedUser}.`);
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                text: "An error occurred while giving the Pokémon."
            });
        }
    }
};
