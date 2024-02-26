module.exports = {
  name: 'bid',
  aliases: ['auction-bjd'],
  category: 'auction',
  exp: 5,
  react: "✅",
  description: 'bids amount',
  async execute(client, arg, M) {
    const auc = await client.DB.get(`${M.from}.auctionInProgress`) || true;
       if (!auc) return M.reply("A auction is already going on");

    const auction = (await client.DB.get('auction')) || [];

    if (!auction.includes(M.from)) return M.reply(`Join the auction group by using ${client.prefix}support`);
    else if (!arg) return M.reply('Please provide the amount');
    
    else {
      const amount = parseInt(arg);
  
      if (isNaN(amount)) return M.reply('Please provide a valid amount');
  
      else if (arg.startsWith('-') || arg.startsWith('+')) return M.reply('Please provide a positive amount');
  
      const cradits = (await client.cradit.get(`${M.sender}.wallet`)) || 0;
  
      const bid = (await client.cradit.get(`{M.from}.bid`)) || 0;
  
      if (amount > cradits) return M.reply('You do not have enough credits for this bid');
  
      else if (amount < bid) return M.reply("You cannot bid less than the highest bid");
  
      else {
        await client.cradit.set(`${M.from}.bid`, amount);
        await client.DB.set(`${M.from}.auctionWinner`, M.sender);
        let Text = `You have placed a bid of ${amount}`;
  
        M.reply(Text);
      }
    }
  }
}
