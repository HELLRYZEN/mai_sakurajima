const cron = require("node-cron");
const axios = require('axios');
const path = require('path');
const { calculatePokeExp } = require('../Helpers/pokeStats');
require("./Message");

module.exports = PokeHandler = async (client, m) => {
  try {
    let wilds = await client.DB.get('wild');
    const wild = wilds || [];

    if (wild.length > 0) {
      const randomIndex = Math.floor(Math.random() * wild.length);
      const randomJid = wild[randomIndex];
      let jid = randomJid;

      if (wild.includes(jid)) {
        cron.schedule('*/20 * * * *', async () => {
          try {
            const id = Math.floor(Math.random() * 1025);
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const pokemon = response.data;

            const name = pokemon.name;
            const types = pokemon.types.map(type => type.type.name);
            const image = pokemon.sprites.other['official-artwork'].front_default;
            const level = Math.floor(Math.random() * (30 - 15) + 15);
            const requiredExp = calculatePokeExp(level);
            
            // Extracting base stats
            const baseStats = {};
            pokemon.stats.forEach(stat => {
              baseStats[stat.stat.name] = stat.base_stat;
            });

            const moves = pokemon.moves
              .filter(move => move.version_group_details[0].level_learned_at === 1) // Filter moves learned at level 1
              .map(move => ({
                name: move.move.name,
                power: move.move.power,
                accuracy: move.move.accuracy,
                pp: move.move.pp,
                type: move.move.type ? move.move.type.name : 'Normal',
                description: move.move.description
              }));

            const pokemonData = { 
              name: name, 
              level: level, 
              pokexp: requiredExp,
              id: pokemon.id,
              maxHP: baseStats['hp'],
              maxAttack: baseStats['attack'],
              maxDefense: baseStats['defense'],
              maxSpeed: baseStats['speed'],
              type: types,
              moves: moves,
              state: {
                status: '',
                movesUsed: 0
              },
            };

            console.log(`Spawned: ${pokemonData.name} in ${jid}`);
            await client.DB.set(`${jid}.pokemon`, pokemonData);

            const message = `*🧧 ᴀ ɴᴇᴡ ᴘᴏᴋᴇᴍᴏɴ ᴀᴘᴘᴇᴀʀᴇᴅ 🧧*\n\n *💥 Type:* ${types.join(', ')} \n\n *🀄ʟevel:* 「 ${level} 」 \n\n *Moves:* ${moves.map(move => move.name).join(', ')} \n\n *ᴛʏᴘᴇ ${client.prefix}ᴄᴀᴛᴄʜ < ᴘᴏᴋᴇᴍᴏɴ_ɴᴀᴍᴇ >, to get it in your dex*`;

            await client.sendMessage(jid, {
              image: {
                url: image,
              },
              caption: message,
            });
          } catch (err) {
            console.log(err);
            await client.sendMessage(jid, {
              text: `Error occurred while spawning Pokémon.`
            });
          }      
  
          cron.schedule('*/15 * * * *', async () => {
            await client.DB.delete(`${jid}.pokemon`);
            console.log(`Pokemon deleted after 15 minutes`);
          });
  
        });
      }
    }
  } catch(error) {
    console.log(error);
  }
};
              
