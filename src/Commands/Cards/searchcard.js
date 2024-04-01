const path = require('path');

module.exports = {
  name: "searchcard",
  aliases: ["csearch"],
  exp: 0,
  react: "✅",
  category: "card game",
  usage: 'Use :searchcard <cardName>',
  description: "Search for a card by name in your deck and collection.",
  async execute(client, arg, M) {
    try {
       arg = Array.isArray(arg) ? arg : [arg];
      const deck = await client.DB.get(`${M.sender}_Deck`) || [];
      const collection = await client.DB.get(`${M.sender}_Collection`) || [];

      const searchTerm = arg.join(' ').toLowerCase();

      const cardsInDeck = deck.filter(card => card.toLowerCase().includes(searchTerm));
      const cardsInCollection = collection.filter(card => card.toLowerCase().includes(searchTerm));

      let response = `Search results for "${searchTerm}":\n`;

      if (cardsInDeck.length > 0) {
        response += "**In Deck**:\n";
        cardsInDeck.forEach((card, index) => {
          response += `${index + 1}. Tier: ${deck[index].tier}, Index: ${index + 1}, Card: ${card}\n`;
        });
      }

      if (cardsInCollection.length > 0) {
        response += "**In Collection**:\n";
        cardsInCollection.forEach((card, index) => {
          response += `${index + 1}. Tier: ${collection[index].tier}, Index: ${index + 1}, Card: ${card}\n`;
        });
      }

      if (cardsInDeck.length === 0 && cardsInCollection.length === 0) {
        response += "No cards found.";
      }

      M.reply(response);
    } catch (err) {
      console.error(err);
      await client.sendMessage(M.from, {
        image: { url: client.utils.errorChan() },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`,
      });
    }
  },
};
