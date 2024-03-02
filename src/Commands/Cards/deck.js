const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { createDeflate } = require('zlib');
const ms = require('parse-ms');

module.exports = {
  name: 'deck',
  aliases: ['decks'],
  exp: 0,
  cool: 4,
  react: "✅",
  category: 'card game',
  description: 'Claim the card',
  async execute(client, arg, M) {
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.deck`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

    const deck = await client.DB.get(`${M.sender}_Deck`);
    if (!deck || deck.length === 0) {
      M.reply('No Deck Found');
      return;
    } 
    try{
      const maxCardsInDeck = 12;
      const cardsToMove = deck.slice(maxCardsInDeck);
      const cardsToKeep = deck.slice(0, maxCardsInDeck);
      const collection = await client.DB.get(`${M.sender}_Collection`) || [];
      await client.DB.set(`${M.sender}_Collection`, [...collection, ...cardsToMove]);
      await client.DB.set(`${M.sender}_Deck`, cardsToKeep);
      if (arg) { 
        const index = parseInt(arg) - 1; // The index in the array is 0-based
        if (isNaN(index) || index < 0 || index >= deck.length) {
          M.reply(`Invalid card index. Your deck has ${deck.length} cards.`);
        } else {
          const card = deck[index].split('-');
          const filePath = path.join(__dirname, '../../Handlers/card.json');
          const data = require(filePath);
          const cardsInTier = data.filter((cardData) => cardData.tier === card[1]);
          const cardData = cardsInTier.find((cardData) => cardData.title === card[0]);
          const cardUrl = cardData.url;
          let text = `🃏 Total Deck Cards: ${deck.length}\n\n🏮 Username: ${(await client.contact.getContact(M.sender, client)).username}` 
          text += `\n*#${index + 1}*\n🃏 *Name:* ${card[0]}\n`.concat(`🪄 *Tier:* ${card[1]} \n`)
          const file = await client.utils.getBuffer(cardUrl)
          if(cardUrl.endsWith('.gif')) {
            const giffed = await client.utils.gifToMp4(file);
            await client.sendMessage(M.from, {
              video: giffed,
              gifPlayback: true,
              caption: text
            });
          } else {
            await client.sendMessage(M.from , {image: {url: cardUrl} , caption: text}, {quoted: M});
          }
        }
      } else {
        const images = [];
        const cardText = "";
        const cardMap = new Map(); // Map to store card titles and their counts
        for (let i = 0; i < deck.length; i++) {
          const card = deck[i].split('-');
          const filePath =  path.join(__dirname, '../../Handlers/card.json');
          const data = require(filePath);
          const cardsInTier = data.filter((cardData) => cardData.tier === card[1]);
          const cardData = cardsInTier.find((cardData) => cardData.title === card[0]);
          const cardUrl = cardData.url;
          // Add card image to the images array
          images.push(cardUrl);
          // Update card count in the map
          const cardTitle = `${card[0]}-${card[1]}`;
          cardMap.set(cardTitle, (cardMap.get(cardTitle) || 0) + 1);
        }
        // Filter out duplicate cards from the images array
        const uniqueImages = Array.from(new Set(images));
        
        const canvasWidth = 1050;
        const canvasHeight = 1800;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        const imageWidth = 350;
        const imageHeight = 450;
        const imagePadding = 10;
        const imagesPerRow = 3;
        const rows = 4;
        const xStart = (canvasWidth - (imageWidth * imagesPerRow + imagePadding * (imagesPerRow - 1))) / 2;
        const yStart = (canvasHeight - (imageHeight * rows + imagePadding * (rows - 1))) / 2;
        for (let i = 0; i < uniqueImages.length; i++) {
          const image = await loadImage(uniqueImages[i]);
          const x = xStart + (i % imagesPerRow) * (imageWidth + imagePadding);
          const y = yStart + Math.floor(i / imagesPerRow) * (imageHeight + imagePadding);
          ctx.drawImage(image, x, y, imageWidth, imageHeight);
        }
        const directory = require('os').tmpdir();
        const filePath = path.join(directory, 'collage.png');
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);
        const caption = `${(await client.contact.getContact(M.sender, client)).username}'s Deck\n\n Total Cards: ${deck.length}\n${cardText}`;
        client.sendMessage(M.from, {
          image: {url: filePath},
          caption: caption
        });
        await client.DB.set(`${M.sender}.slot`, Date.now());
      } 
    } catch(err){
      console.log(err)
      await client.sendMessage(M.from , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`})
    }
  },
};