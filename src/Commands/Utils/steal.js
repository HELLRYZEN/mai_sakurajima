const { Sticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
    name: 'steal',
    aliases: ['take'],
    category: 'utils',
    exp: 10,
    cool: 4,
    react: "✅",
    description: 'Steal [quote message containing sticker] <pack> | <author>',
    async execute(client, arg, M) {
        try {
            const content = JSON.stringify(M.quoted);
            const isQuotedSticker = M.type === 'extendedTextMessage' && content.includes('stickerMessage');

            if (isQuotedSticker) {
                // Split pack and author from the argument
                const [packName, authorName] = arg.split('|').map(part => part.trim());
                
                // Download the quoted sticker
                const buffer = await M.quoted.download();

                // Create a new sticker instance
                const sticker = new Sticker(buffer, {
                    pack: packName || '👾 Handcrafted for you by',
                    author: authorName || 'aurora 👾',
                    type: StickerTypes.FULL,
                    categories: ['🤩', '🎉'],
                    quality: 70
                });

                // Build and send the sticker
                await client.sendMessage(
                    M.from,
                    {
                        sticker: await sticker.build()
                    },
                    {
                        quoted: M
                    }
                );
            } else {
                return M.reply('Please quote the message containing the sticker.');
            }
        } catch (error) {
            console.error('Error while executing steal command:', error);
            await M.reply('An error occurred while processing the command.');
        }
    }
};