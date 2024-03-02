const ms = require('parse-ms');

module.exports = {
    name: "buy-card",
    aliases: ["b-c"],
    exp: 0,
    cool: 4,
    react: "✅",
    category: "card shop",
    description: 'To buy cards from card shop',
    async execute(client, arg, M) {
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.buyc`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        const auction = (await client.DB.get('cshop')) || [];
        if (!auction.includes(M.from)) return M.reply(`Join the official group by using ${client.prefix}support, every saturday card shop commands are turned on`);
        
        let dime = await client.rpg.get(`${M.sender}.diamond`) || 0;

        const cardPrices = {
            "1": 50000,
            "2": 40000,
            "3": 45000,
            "4": 60000,
            "5": 40000,
            "6": 55000,
            "7": 65000,
            "8": 50000,
            "9": 45000,
            "10": 70000
        };

        const cardNames = {
            "1": "Madara",
            "2": "Goku",
            "3": "Yuji Itadori and Sukuna",
            "4": "Tanjiro",
            "5": "Genos",
            "6": "Allen Walker",
            "7": "Yae Miko",
            "8": "Broly",
            "9": "Hayase Nagatoro",
            "10": "Ace x Sabo x Luffy"
        };

        if (!cardPrices[arg]) return M.reply("Invalid card number.");

        if (dime < cardPrices[arg]) return M.reply("You don't have enough diamonds.");

        await client.DB.push(`${M.sender}_Collection`, `${cardNames[arg]}-6`);
        await client.rpg.sub(`${M.sender}.diamond`, cardPrices[arg]);
        M.reply(`You have successfully purchased ${cardNames[arg]}. It's in your collection.`);
        await client.DB.set(`${M.sender}.buyc`, Date.now());
    }
};