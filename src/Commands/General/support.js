module.exports = {
     name: 'support',
     aliases: ['support'],
     category: 'general',
     exp: 5,
     cool: 4,
     react: "✅",
    description: 'Gives links of official gcs',
     async execute(client, arg, M) {
        
        const videos = [
             'https://telegra.ph/file/f0c24da2961de0bede5e1.mp4',
             'https://telegra.ph/file/f7d87038dc8c486c1a094.mp4',
             'https://telegra.ph/file/672375c8205e1f126f200.mp4'
        ];
        const randomRes = videos[Math.floor(Math.random() * videos.length)];
         const ariLogo = "https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg"

        let supportG = `*━『 Support Group Links 』━*\n\n* [ Aurora Support ] :*\np\nDescription: This is the main group of our bot, here rpg commands , game commands and card shop commands will work\n* [ Aurora Auction ] :*\np\nDescription: Here every weekend auctions of events auction of event cards takes place and on every nee 100 user a grand auction takes place\n* [ Aurora Casino ] :**\np\nDescription: Here you can do slots and gamble to increase your money\n\n`
        supportG += `website= `  
        supportG += `ʏᴏᴜᴛᴜʙᴇ =`  
        supportG += `ɢᴍᴀɪʟ = `
        let text = [
             "Together we rise, together we fall, but always together in this anime world we call home. Welcome to the support group.",
             "Together we rise, together we fall, but always together in this anime world we call home. Welcome to the support group.",
             "Behind every successful anime lover, there's a great support group. And you just found one.",
             "Behind every successful anime lover, there's a great support group. And you just found one.",
            "In this group, we don't just talk about anime, we support each other's passions, goals and dreams. Welcome to the family.",
            "In this group, we don't just talk about anime, we support each other's passions, goals, and dreams. Welcome to the family.",
             "Life can be tough, but with anime and this support group, we can conquer anything. Are you ready to join the journey?",
             "Life can be tough, but with anime and this support group, we can conquer anything. Are you ready to join the journey?",
            "This group is more than just a chat room. It's a community of people who share the same love and passion for anime. Join us and let's grow together.",
            "In this group, we don't judge, we don't discriminate, we don't hate. We support each other through thick and thin. Are you ready to be part of something special?",
            "Welcome to the support group, where the anime never ends and the support is always here.",
            "In this group, we don't just watch anime, we live it. And we're here to support each other through every step of the way.",
            "In this group, we believe that friendship, support, and anime can conquer anything. Welcome to the journey.",
            "When the world seems to be against you, remember that you have a support group that's got your back!",
            "Together, we're stronger than any obstacle that comes our way.",
            "We may come from different walks of life, but here in this support group, we're all united by our love for anime!",
            "If you ever feel lost, remember that you're not alone. We're all here to help you find your way.",
            "Being part of this support group means that you always have a safe space to be yourself.",
            "In this group, we don't just talk about anime - we also support each other through thick and thin!",
            "When life gets tough, remember that you have a group of like-minded individuals who are always ready to listen and lend a helping hand.",
            "In this support group, we don't judge - we accept and support each other, flaws and all.",
            "Our shared love for anime is what brought us together, but it's our support and understanding that keep us together.",
            "No matter what challenges come our way, we'll always have each other to rely on.",
            "This support group is more than just a chat - it's a family.",
            "We may be virtual friends, but our support for each other is very real.",
            "The power of this support group lies in the fact that we're all in this together.",
            "In this group, we're all equal - our differences only make us stronger.",
            "Life can be tough, but with the support of this group, anything is possible!",
            "When you're feeling down, remember that there's a group of people who care about you and want to see you succeed.",
            "We may not have superpowers, but we have each other - and that's something special.",
            "In this support group, we lift each other up and help each other grow.",
            "When you're part of this group, you never have to face your struggles alone.",
            "Our love for anime is what connects us, but our support for each other is what makes us a family.",
        ];
        const ran = text[Math.floor(Math.random() * text.length)];

        const final = supportG.concat(ran);

        await client.sendMessage(M.from, { video: { url: randomRes }, gifPlayback: true, caption: `*Dmed you the group link*` }, { quoted: M });
        await client.sendMessage(M.sender, { image: { url: ariLogo }, caption: final }, { quoted: M });
    }
};