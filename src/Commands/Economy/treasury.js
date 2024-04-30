// Treasury Command
module.exports = {
    name: 'treasury',
    aliases: ['at'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :treasury',
    description: 'Shows the treasury value of user',
    async execute(client, arg, M) {
        const userId = M.sender;

        // Check if the user is already registered
        let economy = await client.econ.findOne({ userId });
        if (!economy) {
            // If user is not registered, create a new economy record for them
            economy = await client.econ.create({ userId });
            M.reply('Yiu have been registered in the economy database')
        }

        const treasury = economy.treasury;

        const contact = await client.contact.getContact(M.sender, client);
        const username = contact.username || 'Unknown';
        const tag = `#${M.sender.substring(3, 7)}`;
        const thumbnail = await client.utils.getBuffer('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRBfcfZ3LyY8EzPbH5LbHYOxOW0p7Ki5aIenqTSFm5YQ&s.jpg');

        await client.sendMessage(M.from, {
            text: "",
            contextInfo: {
                externalAdReply: {
                    title: `${username}: ${treasury}`,
                    mediaType: 2,
                    thumbnail: thumbnail,
                    sourceUrl: ''
                }
            }
        });
    }
};
