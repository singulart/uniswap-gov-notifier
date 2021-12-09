import express from 'express'
import {Express} from 'express-serve-static-core'
import cron from 'node-cron'
import {fetchProposals} from '../dataload/moralis'

/********************************************************************************************
 *                              Set up cron task to read the new proposals from Moralis API
 ********************************************************************************************/
cron.schedule('0 */1 * * * *', function() {
    console.log("Here")
    fetchProposals('', '')
});


export async function createServer(): Promise<Express> {
  const server = express()
  return server
}
