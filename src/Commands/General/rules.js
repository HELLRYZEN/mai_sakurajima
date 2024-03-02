const ms = require('parse-ms');

module.exports = {
name: 'rule',
aliases: ['rules'],
category: 'general',
exp: 15,
cool: 4,
react: "✅",
description: 'This is noteboard, guide and rules board. You can check here about updates, about guide or about rules.',
async execute(client, arg, M) {
  
  const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.rules`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

  const image = await client.utils.getBuffer('https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg');

  const text = ''
  text += `👑Rules👑`
  text += `1) *No spam in bot*\n`
  text += `2) *Don't send unnecessary things to the bot*\n`
  text += `3) *Don't fight or use slang in our official groups*\n`
  text += `4) *Any rule breaking may result in a ban*\n`
  text += `5) *In one auction one user can only win a single card*\n`
  text += `6) *From card shop a user can only buy a single card from the shop*\n\n`;
  await client.sendMessage(M.from, { image: { url: image }, caption: text }, { quoted: M });
  await client.DB.set(`${M.sender}.rules`, Date.now());
       }
      } 