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
cron.schedule('0 */4 * * *', function() {
    
  const dateFrom = moment().utc().subtract(4, 'hours');
  const formattedDateFrom = dateFrom.format();
  console.log(`Checking for new proposals created or uploaded since ${formattedDateFrom}`);

  fetchGovernanceEvents(formattedDateFrom, moment().utc().format(dateFormat))
  .then( async (governanceEvents: IEventItem[]) => {
    if(governanceEvents.length == 0) {
      console.log(`No governance updates since ${formattedDateFrom}`)
      return 0
    }
    const discord: Client = await discordClient()
    discord.on("ready", () => {
      governanceEvents.forEach( async (event: IEventItem) => {
        const channel: BaseGuildTextChannel = await discord.channels.fetch(channelId) as BaseGuildTextChannel;
        if (!channel) {
          console.log(`Unable to find Discord channel ${channelId}`)
          return 0;
        } else {
          if (event.resolvedName === "ProposalCreated") {
            const newProposalEmbed = new Discord.MessageEmbed()
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
            .setImage('https://i.imgur.com/hqWs2R9.jpg') //feel free to change ;) 
            .setTimestamp();  
            channel.send({ embeds: [newProposalEmbed] })
            .then(message => console.log(`Sent message`))
            .catch(console.error);

          } else if (event.resolvedName === "VoteCast") {
            const voteCastEmbed = new Discord.MessageEmbed()
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
            .setImage('https://i.imgur.com/IXZDOTG.jpg')
            .setTimestamp();  
            channel.send({ embeds: [voteCastEmbed] })
            .then(message => console.log(`Sent message: ${message.content}`))
            .catch(console.error);

          } else if (event.resolvedName === "ProposalQueued") {
            const voteCastEmbed = new Discord.MessageEmbed()
            .setColor('#F3CFC6')
            .setTitle(`Proposal #${event.payload['id']} queued`)
            .setURL(`https://sybil-interface.vercel.app/#/proposals/uniswap/${event.payload['id']}`)
            .setDescription(`Vote is over. Proposal entered the grace period`)
            .addFields(
              { name: 'ID', value: event.payload['id'], inline: true },
              { name: 'ETA', value: moment(new Date(+event.payload['eta'] * 1000)).toLocaleString(), inline: true},
              { name: 'Block #', value: event.block_number, inline: true},
              { name: 'Tx Hash', value: event.transaction_hash, inline: true }
            )
            .setTimestamp();  
            channel.send({ embeds: [voteCastEmbed] })
            .then(message => console.log(`Sent message: ${message.content}`))
            .catch(console.error);

          } else if (event.resolvedName === "ProposalExecuted") {
            const voteCastEmbed = new Discord.MessageEmbed()
            .setColor('#F3CFC6')
            .setTitle(`Proposal #${event.payload['id']} executed`)
            .setURL(`https://sybil-interface.vercel.app/#/proposals/uniswap/${event.payload['id']}`)
            .setDescription(`Proposal executed successfully`)
            .addFields(
              { name: 'ID', value: event.payload['id'], inline: true },
              { name: 'Block #', value: event.block_number, inline: true},
              { name: 'Tx Hash', value: event.transaction_hash, inline: true },
              { name: 'Executed at', value: event.block_timestamp, inline: true },
            )
            .setTimestamp();  
            channel.send({ embeds: [voteCastEmbed] })
            .then(message => console.log(`Sent message: ${message.content}`))
            .catch(console.error);
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
