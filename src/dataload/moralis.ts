import axios from "axios";
import { bravoEvents } from '../uniswap/bravo'
import Web3 from "web3";

const bravoAddress = process.env.BRAVO_ADDRESS || '0x408ED6354d4973f66138C91495F2f2FCbd8724C3'
const chain = process.env.CHAIN || 'eth'
const moralisApiKey = process.env.MORALIS_API_KEY || 'INSERT YOUR API KEY!'
const provider = process.env.PROVIDER || ''
const web3 = new Web3(provider);

// todo use date filters! 
export const fetchProposals = async (fromDate: string, toDate: string) => {

    const moralisResponse: IMoralisResponse = (await axios.get(`https://deep-index.moralis.io/api/v2/${bravoAddress}/logs?chain=${chain}`, { 
        headers: {
            'X-API-Key': moralisApiKey
        }}
    )).data

    if(moralisResponse.result) {
        moralisResponse.result.map( (event) => {
            if(bravoEvents.get(event.topic0)) {
                console.log(bravoEvents.get(event.topic0)['name'])
                console.log(
                    web3.eth.abi.decodeLog(
                        bravoEvents.get(event.topic0)['inputs'], 
                        event.data, 
                        [event.topic1, event.topic2, event.topic3]))
            }
        } )
    }
}


interface IMoralisResponse {
    result: IEventItem[]
}

interface IEventItem {

    transaction_hash: string,
    address: string,
    block_timestamp: string,
    block_number: string,
    block_hash: string,
    data: string,
    topic0: string,
    topic1: string,
    topic2: string,
    topic3: string
}
