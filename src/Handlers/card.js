const cron = require("node-cron");
const axios = require('axios');
const path = require('path');
require("./Message");

module.exports = CardHandler = async (client, m) => {
    try {
        let cardgames = await client.DB.get('cards');
        const cardgame = cardgames || [];

        if (cardgame.length > 0) {
            const randomIndex = Math.floor(Math.random() * cardgame.length);
            const randomJid = cardgame[randomIndex];
            let jid = randomJid;
            console.log(jid);

            if (cardgame.includes(jid)) {
                let count = 0;
                let sOr6Counter = 0;
                const sOr6Interval = 10;
                const sOr6Limit = 100;

                cron.schedule('*/10 * * * *', async () => {
                    try {
                        const filePath = path.join(__dirname, '../Helpers/spawn.json');
                        const data = require(filePath);

                        const index = Math.floor(Math.random() * data.length);
                        const card = data[index];

                        let price;
                        switch (card.tier) {
                            case "1":
                                price = client.utils.getRandomInt(1000, 2000);
                                break;
                            case "2":
                                price = client.utils.getRandomInt(2000, 3000);
                                break;
                            case "3":
                                price = client.utils.getRandomInt(3000, 5000);
                                break;
                            case "4":
                                price = client.utils.getRandomInt(5000, 8000);
                                break;
                            case "5":
                                price = client.utils.getRandomInt(15000, 20000);
                                break;
                            case "6":
                                price = client.utils.getRandomInt(30000, 60000);
                                break;
                            case "S":
                                price = client.utils.getRandomInt(60000, 100000);
                                break;
                        }

                        const code = client.utils.getRandomInt(11111, 99999);

                        console.log(`Sended: ${card.tier}  Name: ${card.title}  For ${price} in ${jid}`);

                        await client.cards.set(`${jid}.card`, `${card.title}-${card.tier}`);
                        await client.cards.set(`${jid}.cardPrice`, price);
                        await client.cards.set(`${jid}.code`, code);

                        // Sending message to claim the card
                        if (card.tier === '6' || card.tier === 'S') {
                            const giif = await client.utils.getBuffer(card.url);
                            const cgif = await client.utils.gifToMp4(giif);
                            await client.sendMessage(jid, {
                                video: cgif,
                                caption: `*━『  🎊Finally a rare card has spawned🎊 』━*\n\n🎴 *Name:* ${card.title}\n\n🎐 *Tier:* ${card.tier}\n\n🪩 *Price:* ${price}\n\n🎴 *code:* ${code}\n\n🔖 Use *${client.prefix}collect <code>* to claim the card, your card will be stored in you deck`,
                                gifPlayback: true,
                            });
                        } else {
                            await client.sendMessage(jid, {
                                image: {
                                    url: card.url,
                                },
                                caption: `*━『 🎊A new card has spawned🎊 』━*\n\n🎴 *Name:* ${card.title}\n\n🎐 *Tier:* ${card.tier}\n\n🪩 *Price:* ${price}\n\n🎴 *code:* ${code}\n\n🔖 Use *${client.prefix}collect <code>* to claim the card, your card will be stored in you deck`,
                            });
                        }
                    } catch (err) {
                        console.log(err);
                        await client.sendMessage(jid, {
                            image: { url: `${client.utils.errorChan()}` },
                            caption: `${client.utils.greetings()} Error-Chan Dis\n\nCommand no error wa:\n${err}`
                        });
                    }

                // Cron job to delete card details after 30 minutes
                cron.schedule('*/5 * * * *', async () => {
                    await client.cards.delete(`${jid}.card`);
                    await client.cards.delete(`${jid}.cardPrice`);
                    await client.cards.delete(`${jid}.code`);
                    console.log(`Card deleted after 30 minutes`);
                });
                    });
            }
        }
    } catch (error) {
        console.log(error);
    }
};
