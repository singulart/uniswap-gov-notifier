import express from 'express'
import {Express} from 'express-serve-static-core'
import cron from 'node-cron'

/************************************************************************************
 *                              Set up cron task to read and publish proposals
 ***********************************************************************************/
// Don't forget to syncronise the cron settings and 'createdAt' filter in the actual API call,
// otherwise you'll get duplicate proposal notifications
cron.schedule('0 */5 * * * *', function() {
    console.log("Here")
});


export async function createServer(): Promise<Express> {
  const server = express()
  return server
}
