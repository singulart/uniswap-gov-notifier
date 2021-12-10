import { BaseGuildTextChannel, Client }  from 'discord.js';
import express from 'express'
import {Express} from 'express-serve-static-core'
import cron from 'node-cron'
import {fetchProposals} from '../dataload/moralis'
import { channelId, discordClient } from '../discord/client';
import { IEventItem } from '../types'; 

const Discord = require("discord.js");

/********************************************************************************************
 *                              Set up cron task to read the new proposals from Moralis API
 ********************************************************************************************/
cron.schedule('0 */1 * * * *', function() {
    console.log("Here")
    fetchProposals('', '').then((governanceEvents: Map<string, IEventItem>) => {
      discordClient().then( (discord: Client) => {
        governanceEvents.forEach((event: IEventItem, eventName: string) => {
          const channel: BaseGuildTextChannel = discord.channels.cache.get(channelId) as BaseGuildTextChannel;
          if (!channel) {
            console.log(`Unable to find Discord channel ${channelId}`)
            return 0;
          } else {
            if (eventName === "ProposalCreated") {
              const exampleEmbed = new Discord.MessageEmbed()
              .setColor('#F3CFC6') 
              .setTitle("New Proposal Created")
              // .setURL(`https://play.joystream.org/video/${edge.node.id}`)
              .setDescription(event.payload['description'])
              .addFields(
                { name: 'ID', value: event.payload['id'], inline: true },
                { name: 'Block #', value: event.block_number, inline: true},
                { name: 'Created At', value: event.block_timestamp, inline: true },
                { name: 'Tx Hash', value: event.transaction_hash, inline: true },
                { name: 'Proposer', value: event.payload['proposer'], inline: true },
                { name: 'Start Block', value: event.payload['startBlock'], inline: true },
                { name: 'End Block', value: event.payload['endBlock'], inline: true },
              )
              .setTimestamp();  
              channel.send(exampleEmbed)
              .then(message => console.log(`Sent message: ${message.content}`))
              .catch(console.error);
  
            } else if (eventName === "VoteCast") {
              // const exampleEmbed = new Discord.MessageEmbed()
              // .setColor('#F3CFC6')
              // .setTitle("New Vote")
              // .setURL(`https://play.joystream.org/video/${edge.node.id}`)
              // .setDescription(edge.node.description.substring(0, 200)) // cut off lengthy descriptions
              // .addFields(
              //   { name: 'ID', value: edge.node.id, inline: true },
              //   { name: 'Category', value: edge.node.category.name, inline: true},
              //   { name: 'Duration', value: durationFormat(edge.node.duration), inline: true },
              //   { name: 'Language', value: edge.node.language.iso, inline: true },
              //   { name: 'Size', value: humanFileSize(edge.node.mediaDataObject.size), inline: true },
              //   { name: 'License', value: licenses[licenseKey], inline: true },
              // )
              // .setTimestamp();  
              // channel.send(exampleEmbed)
              // .then(message => console.log(`Sent message: ${message.content}`))
              // .catch(console.error);
  
            } else if (eventName === "VoteCast") {
              // const exampleEmbed = new Discord.MessageEmbed()
              // .setColor('#4038FF') // official joystream blue, see https://www.joystream.org/brand/guides/
              // .setTitle(edge.node.title)
              // .setURL(`https://play.joystream.org/video/${edge.node.id}`)
              // .setDescription(edge.node.description.substring(0, 200)) // cut off lengthy descriptions
              // .addFields(
              //   { name: 'ID', value: edge.node.id, inline: true },
              //   { name: 'Category', value: edge.node.category.name, inline: true},
              //   { name: 'Duration', value: durationFormat(edge.node.duration), inline: true },
              //   { name: 'Language', value: edge.node.language.iso, inline: true },
              //   { name: 'Size', value: humanFileSize(edge.node.mediaDataObject.size), inline: true },
              //   { name: 'License', value: licenses[licenseKey], inline: true },
              // )
              // .setTimestamp();  
              // channel.send(exampleEmbed)
              // .then(message => console.log(`Sent message: ${message.content}`))
              // .catch(console.error);  
            }
          }
        })
      })  
    })
});


export async function createServer(): Promise<Express> {
  const server = express()
  return server
}
