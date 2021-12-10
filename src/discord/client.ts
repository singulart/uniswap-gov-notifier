import { Client } from "discord.js";
import Discord from "discord.js";

export const channelId = process.env.CHANNEL_ID || 'CHANNEL ID NOT SET!!!'; // environment variable CHANNEL_ID must be set
const token = process.env.TOKEN; // environment variable TOKEN must be set

export const discordClient = async (): Promise<Client> => {

    const client = new Discord.Client({intents: []});
    
    client.once("ready", async () => {
      console.log('Discord.js client ready');
      await client.channels.fetch(channelId);
    });
    
    await client.login(token); 
    console.log('Bot logged in successfully');
    
    return client;
}
