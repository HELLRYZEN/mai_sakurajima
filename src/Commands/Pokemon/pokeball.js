const items = {
    buy: [
      { pokeball: 1200 },
    ]
  };

module.exports = {
    name: 'purchase',
    aliases: ['purchase'],
    category: 'pokemon',
    exp: 10,
    cool: 4,
    react: '✅',
    usage: 'Use :purchase <item_name>',
    description: 'Buy an item from the shop',
    async execute(client, arg, M) {
      
      if (!arg) return M.reply('Please give an item name');
      const term = arg.split(' ');
      const actionItems = Object.keys(Object.assign({}, ...items.buy));
      const itemName = term[0].toLowerCase();
      if (!actionItems.includes(itemName)) return M.reply('Please give a valid item name');
      const credits = (await client.credit.get(`${M.sender}.wallet`)) || 0;
      const price = parseInt(Object.values(items.buy[actionItems.indexOf(itemName)]));
      const quantity = parseInt(term[1]) || 1;
  
      if ((credits - price * quantity) < 0) return M.reply(`You don't have enough in your wallet to buy ${itemName}`);
      await client.rpg.add(`${M.sender}.${itemName}`, quantity);
      await client.credit.sub(`${M.sender}.wallet`, price * quantity);
      M.reply(`*Thank you 🎉 for your purchase*\n*Now you have _${client.utils.capitalize(itemName)}: ${(await client.rpg.get(`${M.sender}.${itemName}`)) || 0}_*`);
    },
};
