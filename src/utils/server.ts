import { BaseGuildTextChannel, Client }  from 'discord.js';
import express from 'express'
import {Express} from 'express-serve-static-core'
import cron from 'node-cron'

import {fetchGovernanceEvents} from '../dataload/moralis'
import { channelId, discordClient } from '../discord/client';
import { IEventItem } from '../types'; 
import Discord from "discord.js";
import moment from 'moment';


const dateFormat = 'YYYY-DD-MMMTHH:mm:ssZ'

/********************************************************************************************
 *                              Set up cron task to read the new proposals from Moralis API
 ********************************************************************************************/
cron.schedule('0/15 * * * * *', function() {
    
  const dateFrom = moment().utc().subtract(4, 'hours');
  const formattedDateFrom = dateFrom.format();

  fetchGovernanceEvents(formattedDateFrom, moment().utc().format(dateFormat))
  .then( async (governanceEvents: IEventItem[]) => {
    const discord: Client = await discordClient()
    discord.on("ready", () => {
      governanceEvents.forEach( async (event: IEventItem) => {
        const channel: BaseGuildTextChannel = await discord.channels.fetch(channelId) as BaseGuildTextChannel;
        if (!channel) {
          console.log(`Unable to find Discord channel ${channelId}`)
          return 0;
        } else {
          if (event.resolvedName === "ProposalCreated") {
            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#F3CFC6') 
            .setTitle(`New Governance proposal #${event.payload['id']} created`)
            .setURL(`https://sybil-interface.vercel.app/#/proposals/uniswap/${event.payload['id']}`)
            .setDescription(event.payload['description'].substring(0, 4096))
            .addFields(
              { name: 'ID', value: event.payload['id'], inline: true },
              { name: 'Block #', value: event.block_number, inline: true},
              { name: 'Created At', value: event.block_timestamp, inline: true },
              { name: 'Tx Hash', value: event.transaction_hash, inline: true },
              { name: 'Proposer', value: event.payload['proposer'], inline: true },
              { name: 'Start Block', value: event.payload['startBlock'], inline: true },
              { name: 'End Block', value: event.payload['endBlock'], inline: true }
            )
            .setTimestamp();  
            channel.send({ embeds: [exampleEmbed] })
            .then(message => console.log(`Sent message: ${message.content}`))
            .catch(console.error);

          } else if (event.resolvedName === "VoteCast") {
            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#F3CFC6')
            .setTitle(`New Vote on Proposal #${event.payload['proposalId']}`)
            .setURL(`https://sybil-interface.vercel.app/#/proposals/uniswap/${event.payload['proposalId']}`)
            .setDescription(`Address ${event.payload['voter']} cast their vote. ${event.payload['reason']}`)
            .addFields(
              { name: 'Proposal ID', value: event.payload['proposalId'], inline: true },
              { name: 'Block #', value: event.block_number, inline: true},
              { name: 'Vote Cast At', value: event.block_timestamp, inline: true },
              { name: 'Tx Hash', value: event.transaction_hash, inline: true },
              { name: 'Voter', value: event.payload['voter'], inline: true }
            )
            .setTimestamp();  
            channel.send({ embeds: [exampleEmbed] })
            .then(message => console.log(`Sent message: ${message.content}`))
            .catch(console.error);
          } else if (event.resolvedName === "VoteCast") {
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
