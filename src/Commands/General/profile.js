const { getStats } = require('../../lib/stats');

module.exports = {
    name: 'profile',
    aliases: ['p'],
    category: 'general',
    exp: 5,
    cool: 4,
    react: "👀",
    description: 'Gives you your stats',
    async execute(client, arg, M) {
        const groupMetadata = await client.groupMetadata(M.from);
        const groupMembers = groupMetadata?.participants || [];
        const groupAdmins = groupMembers.filter((v) => v.isAdmin).map((v) => v.id);
        const user = M.quoted?.participant || M.mentions[0] || M.sender;
        const collection = (await client.DB.get(`${user}_Collection`)) || [];
        const deck = await client.DB.get(`${user}_Deck`);
        let bank = await client.DB.get(`${user}.bank`) || 0;
        let wallet = await client.DB.get(`${user}.wallet`) || 0;

        let pfp;
        try {
            pfp = await client.profilePictureUrl(user, 'image');
        } catch {
            pfp = 'https://w0.peakpx.com/wallpaper/346/996/HD-wallpaper-love-live-sunshine-404-error-love-live-sunshine-anime-girl-anime.jpg';
        }

        let bio;
        try {
            bio = (await client.fetchStatus(user)).status;
        } catch {
            bio = '';
        }

        const level = (await client.DB.get(`${user}_LEVEL`)) || 1;
        const stats = getStats(level);
        const username = (await client.contact.getContact(user, client)).formattedName;
        const experience = (await client.exp.get(user)) || 0;
        const banned = (await client.DB.get('banned')) || [];

        let text = '';
        text += `🏮 *Username:* ${username}#${user.substring(3, 7)}\n\n`;
        text += `🎫 *Bio:* ${bio}\n\n`;
        text += `🍀 *Level:* ${level}\n\n`;
        text += `💈 *Number:* wa.me/${user.split('@')[0]}\n\n`;
        text += `🌟 *XP:* ${experience}\n\n`;
        text += `🥇 *Rank:* ${stats.rank}\n\n`;
        text += `👑 *Admin:* ${groupAdmins.includes(user) ? 'True' : 'False'}\n\n`;
        text += `✖ *Ban:* ${banned.includes(user) ? 'True' : 'False'}\n\n`;
        text += `💰 *Wallet:* ${wallet}\n\n`;
        text += `🏦 *Bank:* ${bank}\n\n`;
        text += `🃏 *Deck:* ${deck.length}\n\n`;
        text += `🗃️ *Collection:* ${collection.length}\n\n`;

        client.sendMessage(
            M.from,
            {
                image: {
                    url: pfp
                },
                caption: text
            },
            {
                quoted: M
            }
        );
    }
};
