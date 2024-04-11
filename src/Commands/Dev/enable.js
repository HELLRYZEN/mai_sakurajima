module.exports = {
    name: 'enable',
    aliases: ['e'],
    exp: 0,
    cool: 4,
    react: "✅",
    category: 'dev',
    description: 'Enables a previously disabled command.',
    async execute(client, arg, M) {
        try {
            if (!arg) {
                return M.reply('You need to provide the name of the command to enable.');
            }

            const commandName = arg.toLowerCase(); // Ensure case insensitivity
            const disabledCommands = await client.DB.get('disable-commands') || [];

            const disabledCmdIndex = disabledCommands.findIndex(
              (cmd) => cmd.command === commandName || (command.aliases && command.aliases.includes(cmd.command))
            );

            if (disabledCmdIndex !== -1) {
              // Command is disabled, so remove it from the list of disabled commands
              disabledCommands.splice(disabledCmdIndex, 1);
              await client.DB.set('disable-commands', disabledCommands); // Update the disabled commands list
              M.reply(`Command "${commandName}" has been enabled successfully.`);
            } else {
              M.reply('This command is not disabled.');
            }
        } catch (error) {
            console.error('Error in enabling command:', error);
            M.reply('An error occurred while enabling the command.');
        }
    }
}
