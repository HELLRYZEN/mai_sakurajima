const axios = require('axios');
const fetch = require('node-fetch');
const cron = require('node-cron');
const { calculatePokeExp } = require('../Helpers/pokeStats');

module.exports = PokeHandler = async (client, m) => {
  try {
    let wilds = await client.DB.get('wild');
    const wild = wilds || [];

    if (wild.length > 0) {
      const randomIndex = Math.floor(Math.random() * wild.length);
      const randomJid = wild[randomIndex];
      let jid = randomJid;

      if (wild.includes(jid)) {
        cron.schedule('*/5 * * * *', async () => {
          try {
            const id = Math.floor(Math.random() * 1025); // Ensure ID is within valid range
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const pokemon = response.data;

            const name = pokemon.name;
            const types = pokemon.types.map(type => type.type.name);
            const image = pokemon.sprites.other['official-artwork'].front_default;
            const level = Math.floor(Math.random() * (10 - 5) + 5);
            const requiredExp = calculatePokeExp(level);
            
            // Extracting base stats
            const baseStats = {};
            pokemon.stats.forEach(stat => {
              baseStats[stat.stat.name] = stat.base_stat;
            });

            const dataResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await dataResponse.json();
            const moves = data.moves.slice(0, 2); // Limit moves to first 2
            const movesDetails = await Promise.all(moves.map(async move => {
              const moveUrl = move.move.url;
              const moveDataResponse = await fetch(moveUrl);
              const moveData = await moveDataResponse.json();
              const moveName = move.move.name;
              const movePower = moveData.power || 0;
              const moveAccuracy = moveData.accuracy || 0;
              const movePP = moveData.pp || 5;
              const moveType = moveData.type ? moveData.type.name : 'Normal';
              const moveDescription = moveData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
              return { name: moveName, power: movePower, accuracy: moveAccuracy, pp: movePP, maxPower: moveName, maxPP: movePP, maxAccuracy: moveAccuracy, type: moveType, description: moveDescription };
            }));

            const genderRate = pokemon.gender_rate;
            let isFemale = false;

            if (genderRate >= 8) {
              isFemale = true;
            } else if (genderRate > 0) {
              isFemale = Math.random() * 100 <= genderRate;
            }
            
            const pokemonData = { 
              name: name, 
              level: level, 
              pokexp: requiredExp,
              id: pokemon.id,
              image: image,
              hp: baseStats['hp'],
              attack: baseStats['attack'],
              defense: baseStats['defense'],
              speed: baseStats['speed'],
              maxHp: baseStats['hp'],
              maxAttack: baseStats['attack'],
              maxDefense: baseStats['defense'],
              maxSpeed: baseStats['speed'],
              type: types,
              moves: movesDetails,
              status: '',
              movesUsed: 0,
              female: isFemale
            };

            console.log(`Spawned: ${pokemonData.name} in ${jid}`);
            await client.pokeMap.set(jid, pokemonData);

            const message = `*🧧 ᴀ ɴᴇᴡ ᴘᴏᴋᴇᴍᴏɴ ᴀᴘᴘᴇᴀʀᴇᴅ 🧧*\n\n *💥 Types:* ${types.join(', ')} \n\n *🀄ʟevel:* 「 ${level} 」 \n\n *Available Moves:* ${movesDetails.map(move => move.name).join(', ')} \n\n *ᴛʏᴘᴇ ${client.prefix}ᴄᴀᴛᴄʜ < ᴘᴏᴋᴇᴍᴏɴ_ɴᴀᴍᴇ >, to get it in your dex*`;

            await client.sendMessage(jid, {
              image: {
                url: image,
              },
              caption: message,
            });
          } catch (err) {
            console.log(err);
            await client.sendMessage(jid, {
              text: `Error occurred while spawning Pokémon: ${err.message}`
            });
          }      
  
          cron.schedule('*/3 * * * *', async () => {
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
