module.exports = {
  name: "collect",
  aliases: ["collect"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  usage: 'Use :collect <code>',
  description: "Claim the card that is spawned",
  async execute(client, arg, M) {
    try {
      const code = parseInt(arg); // Get the code provided by the user
      if (isNaN(code)) {
        return M.reply("Please provide a valid code to claim the card.");
      }

      const card = await client.cards.get(`${M.from}.card`); 

      if (!card) {
        return M.reply("There are no cards available to claim.");
      }

      if (code !== parseInt(card.code)) { // Compare provided code with the code from the database
        return M.reply("Invalid code. Please check and try again.");
      }

      const wallet = await client.credit.get(`${M.sender}.wallet`) || 0;
      const price = parseInt(card.price);

      if (wallet < price) {
        return M.reply(`You don't have enough credits in your wallet. Current balance: ${wallet}`);
      }

      await client.credit.sub(`${M.sender}.wallet`, price);

      const [title, tier] = card.name.split("-");
      const deck = await client.DB.get(`${M.sender}_Deck`) || [];
      const collection = await client.DB.get(`${M.sender}_Collection`) || [];
      const maxDeckSize = 12;

      if (deck.length < maxDeckSize) {
        deck.push(card.name);
        await client.DB.set(`${M.sender}_Deck`, deck);
        await M.reply(`🎉 You have successfully claimed *${title} - ${tier}* for *${price} Credits*. It has been added to your deck.`);
      } else {
        collection.push(card.name);
        await client.DB.set(`${M.sender}_Collection`, collection);
        await M.reply(`🎉 You have successfully claimed *${title} - ${tier}* for *${price} Credits*. It has been added to your collection.`);
      }

      await client.cards.delete(`${M.from}.card`);
    } catch (err) {
      await client.sendMessage(M.from, {
        image: { url: `${client.utils.errorChan()}` },
        caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
      });
    }
  },
};
    
