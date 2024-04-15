module.exports = {
    name: 'credit',
    aliases: ['cr', 'credits'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :credit',
    description: 'Shows the wallet value',
    async execute(client, arg, M) {
        let wallet = await client.credit.get(`${M.sender}.wallet`) || 0;

        // Convert negative amount to 0
        if (wallet < 0) {
            wallet = 0;
            client.credit.set(`${M.sender}.wallet`, 0);
        }

        // Convert decimal or fraction amounts to nearest integer
        if (!Number.isInteger(wallet)) {
            wallet = Math.round(wallet);
            client.credit.set(`${M.sender}.wallet`, wallet);
        }

        const contact = await client.contact.getContact(M.sender, client);
        const username = contact.username || 'Unknown';
        const tag = `#${M.sender.substring(3, 7)}`;

        const text = `💳 *Credits* 💳\n\n👤 *Name:* ${username}\n🔖 *Tag:* ${tag}\n💳 *Credits:* ${wallet}`;

        M.reply(text);
    }
};
