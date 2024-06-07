const fs = require('fs'); 
function wish () {
  const hour_now = moment.tz('Asia/Kolkata').
 format('HH')
 let greetings;
 var wishWishes = 'Good Morning 🌅'
 if (hour_now >= '06' && hour_now <= '12') {
   wishWishes = 'Good Morning 🌅' }
   else if (hour_now >= '12' && hour_now <= '17') {
     wishWishes = 'Good Afternoon 🏜️' }
   else if (hour_now >= '17' && hour_now <= '19') {
     wishWishes = 'Good Evening 🌆'}
   else if (hour_now >= '19' && hour_now <= '23') {
     wishWishes = 'Good Night 🌃' }
   else if (hour_now >= '23' && hour_now <= '05') {
     wishWishes = 'Sweet Dreams 💖 Sleep Well' }
   else if (hour_now >= '05' &- hour_now <= '06') {
     wishWishes = 'Go and sleep 😴'}
   else { 
    wishWishes = 'Good Night.!!!' }
   return wishWishes }
   
module.exports = {
  name: 'help',
  aliases: ['h', 'menu', 'list'],
  category: 'general',
  exp: 500,
  cool: 5,
  react: "🌩️",
  usage: 'Use -help for helplist or -help <command_name> to get command info',
  description: 'Displays the command list or specific command info',
  async execute(client, arg, M) {
    try {
      const user = await client.DB.get(`data`);
        const m = M.sender;
        // If user is not in data, push the user
        if (!m.includes(user)) {
            await client.DB.push(`data`, m);
        }
      
      if (!arg) {
        let pushName = M.pushName.trim();
        if (pushName.split(' ').length === 1) {
          pushName = `${pushName} san`;
        }

        const categories = client.cmd.reduce((obj, cmd) => {
          const category = cmd.category || 'Uncategorized';
          obj[category] = obj[category] || [];
          obj[category].push(cmd.name);
          return obj;
        }, {});

        const commandList = Object.keys(categories);

        let commands = '';

        for (const category of commandList) {
          commands += `*𓊈𒆜 ${client.utils.capitalize(category, true)} 𒆜𓊉* \n\`\`\`${categories[category].join(', ')}\`\`\`\n\n`;
        }

        let message = `┌───────────┈ ⳹
│「 Hi 👋 」
└┬❖ 「 𝕭𝖚𝖓𝖓𝖞 𝕾𝖊𝖓𝖕𝖆𝖎 」
┌┤✑  Am I Forget Senpai!! 𖠌
││✑  𝕸𝖆𝖎 𝕾𝖆𝖐𝖚𝖗𝖆𝖏𝖎𝖒𝖆 !!
│└───────────────┈ ⳹
│ 「 *${greetings}* 」
│✙ 「 ${client.prefix}Help 」
└┬──────────────┈ ⳹
   │✑ ꜱᴀʏ.ꜱᴄᴏᴛᴄʜ 𑜱
   └──────────────────┈ ⳹\n${commands}`;
        message +=`✨🕯️· ┈──── ·॥ॐ॥· ────┈ ·🕯️✨`;
        
        await client.sendMessage(
          M.from,
          {
            video: {url: "https://telegra.ph/file/db042f94c3e5d829835e8.mp4"},
            caption: message,
            gifPlayback: true
          },
          {
            quoted: M
          }
          );
        return;
      }

      const command = client.cmd.get(arg) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg));

      if (!command) return M.reply('Command not found');

      const message = `🔸 *Name:* ${command.name}\n♓ *Aliases:* ${command.aliases.join(', ')}\n🌐 *Category:* ${command.category}\n⚜️ *Exp:* ${command.exp}\n🌀 *Cool:* ${command.cool}\n☣️ *Usage:* ${command.usage}\n🔰 *Desc:* ${command.description}`;

      M.reply(message);
    } catch (err) {
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Mai Sakurajima Dis\n\nError:\n${err}` });
    }
  }
};
            
