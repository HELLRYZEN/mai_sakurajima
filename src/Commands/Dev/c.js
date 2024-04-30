const fetch = require('node-fetch');

module.exports = {
    name: "getcard",
    aliases: ["getcard"],
    category: "dev",
    description: "Fetches a random card and displays its details.",
    async execute(client, args, M) {
        try {
            let url = 'https://shit-api.vercel.app/cards/random';
            let cardData;
            let tier;

            do {
                const response = await fetch(url);
                cardData = await response.json();
                tier = cardData.tier.replace('tier ', '');
            } while (tier !== '6' && tier !== 'S');

            const { title, source, id, image } = cardData;
            const price = await client.utils.getRandomInt(10000, 100); // Assuming calculatePrice is a valid function

            const message = `🎊 A new card has spawned 🎊\n\n🏷 *Name:* ${title}\n🪄 *Tier:* ${tier}\n💎 *Price:* ${price}\n\nUse *${client.prefix}collect* to get this card for yourself`;


                const giif = await client.utils.getBuffer(image);
              const cgif = await client.utils.gifToMp4(giif);
                await client.sendMessage(M.from, { video: cgif, gifPlayback: true, caption: message });
     
        } catch (error) {
            console.error(error);
            await client.sendMessage(M.from, { text: "An error occurred while fetching the card." });
        }
    }
};
