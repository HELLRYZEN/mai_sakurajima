const axios = require("axios");
const path = require('path');

module.exports = {
  name: "card-give",
  aliases: ["cg"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  usage: 'Use :cg 1 by tagging',
  description: "Give a card to another user",
  async execute(client, arg, M) {
    try {
      const deck = await client.DB.get(`${M.sender}_Deck`) || [];

      if (!arg) {
        return await M.reply("🤖 Please select the card you wish to give by providing its index or name.");
      }

      const position = parseInt(arg[0], 10) - 1;

      if ([10, 11, 12].includes(position)) {
        return await M.reply("Sorry, but index 10-12 can't be used. You can swap and try again.");
      }

      if (isNaN(position)) return await M.reply('🔍 Please enter a valid index number for the card you want to give.');

      if (position < 0 || position >= deck.length) return await M.reply('🔍 Please enter a valid index number for the card you want to give.');

      if (!M.mentions[0]) {
        return await M.reply("Please tag the user you are giving the card to.");
      }

      if (position >= 9) return await M.reply('You can\'t give cards with an index of 9 or greater. Swap cards to give.');

      if (M.sender === M.mentions[0]) return await M.reply('Nice try, but you can\'t give cards to yourself.');

      const mentionedUserDeck = await client.DB.get(`${M.mentions[0]}_Deck`) || [];
      const card = deck[position];

      mentionedUserDeck.push(card);
      deck.splice(position, 1);

      await client.DB.set(`${M.sender}_Deck`, deck);
      await client.DB.set(`${M.mentions[0]}_Deck`, mentionedUserDeck);

      const filePath = path.join(__dirname, '../../Helpers/card.json');
      const data = require(filePath);
      const cardData = data.find((cardData) => cardData.title === card.split("-")[0] && cardData.tier === card.split("-")[1]);

      let url = cardData ? cardData.url : '';

      const mentionUser = M.mentions[0];

      const replyMsg = cardData ? `🃏 Card *${cardData.title} - ${cardData.tier}* has been gifted to @${mentionUser.split('@')[0]} ! 🎁` : `🃏 Card has been given to @${mentionUser.split('@')[0]} ! 🎁`;

      const messageToSend = `${replyMsg}\n\n@${M.sender.split('@')[0]} gave 🃏 Card *${cardData.title} - ${cardData.tier}* to @${M.mentions[0].split('@')[0]}`;

      await client.sendMessage(M.from, messageToSend);

      // Send notification to group
      await client.sendMessage("120363236615391329@g.us", messageToSend);
    } catch (err) {
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  },
};
