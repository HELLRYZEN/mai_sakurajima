module.exports = {
  name: "party",
  aliases: ["party"],
  exp: 0,
  cool: 4,
  react: "📋",
  category: "pokemon",
  description: "View your caught Pokémon in your party along with their levels",
  async execute(client, arg, M) {
    try {
      const party = await client.DB.get(`${M.sender}_Party`) || [];
      if (party.length === 0) {
        return M.reply("📭 Your Pokémon party is empty!");
      }

      let response = "📋 Your Party:\n";
      party.forEach((pokemon, index) => {
        const [name, level] = pokemon.split("-");
        response += `${index + 1})Name: ${name}\nLevel: ${level}\n\n`;
      });

      await M.reply(response);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
