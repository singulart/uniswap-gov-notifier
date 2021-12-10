export interface IEventItem {

    transaction_hash: string,
    address: string,
    block_timestamp: string,
    block_number: string,
    block_hash: string,
    data: string,
    topic0: string,
    topic1: string,
    topic2: string,
    topic3: string,
    payload: {[key: string]: string},
    resolvedName: string
}