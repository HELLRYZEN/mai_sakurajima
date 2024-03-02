module.exports = {
    name: 'hi',
    aliases: ['hello'],
    category: 'general',
    exp: 0,
    cool: 4, // Cooldown in seconds
    react: "🍥",
    description: 'says hi to bot',
    async execute(client, arg, M) { 
    
        
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }

        const hello = ['konnichiwa', 'hello', 'hi', 'kya haal?', 'bonjour', 'hola', 'hallo'];
        const hi = hello[Math.floor(Math.random() * hello.length)];
        
        const contact = await client.contact.getContact(M.sender, client);
        const username = contact && contact.username ? contact.username : 'there';
        
        await client.DB.set(`${M.sender}.${commandName}`,  now); // Update cooldown timestamp
        M.reply(`${hi} ${username}. How are you today?`);
    }
}
