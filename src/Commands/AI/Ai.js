const { Configuration, OpenAIApi } = require("openai");

module.exports = {
    name: 'gpt',
    aliases: ['ai'],
    category: 'utils',
    exp: 5,
    react: "✅",
    description: 'Let you chat with GPT chat bot',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
        try {
            const configuration = new Configuration({
                apiKey: process.env.openAi,
            });
            const openai = new OpenAIApi(configuration);

            if (!process.env.openAi) {
                return M.reply("Our AI API is not working now, please wait!");
            }
            if (!arg) {
                return M.reply('Provide a query!');
            }

            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            async function generateResponse(prompt, retries = 2) {
                try {
                    const completion = await openai.createChatCompletion({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: prompt }],
                    });

                    console.log("API Key:", process.env.OpenAi);

                    return completion.data.choices[0].message.content.trim();
                } catch (error) {
                    if (error.response && error.response.status === 429 && retries > 0) {
                        const retryAfter = error.response.headers["retry-after"] * 1000 || 5000;
                        M.reply(`Rate limit exceeded. Retrying in ${retryAfter / 1000} seconds...`);
                        await sleep(retryAfter);
                        return generateResponse(prompt, retries - 1);
                    } else {
                        console.error(error);
                        return "Error occurred while generating response - API usage limit exceeded or wrong API key.";
                    }
                }
            }

            const response = await generateResponse(arg);
            return M.reply(response);
        } catch (err) {
            M.reply(err.toString());
            client.log(err, 'red');
        }
    }
};

//const axios = require('axios');

//module.exports = {
  //  name: 'ai',
   // aliases: ['learn'],
   // category: 'Ai',
   // exp: 0,
   // cool: 4,
   // react: "✅",
    //description: 'Let you get interacted with the 3.5 version GPT in whatsapp',
  //  async execute(client, arg, M) {
    //    arg = Array.isArray(arg) ? arg : [arg];
   //     const query = arg.join(' ');
//
  //      try {
          // Fetch information from Wikipedia API
           // const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
////
    //        if (response.data.extract) {
      //          // If information is available, send it as a reply
        //        M.reply(response.data.extract);
          //  } else {
              // If no information is found, send a message indicating it
             //   M.reply(`Sorry, I couldn't find information about "${query}"`);
           // }
    //    } catch (error) {
      //      // If an error occurs during the request, send an error message
        //    console.error('Error:', error.message);
          //  M.reply(`Error: Unable to fetch information about "${query}"`);
        //}
   // }
//};
