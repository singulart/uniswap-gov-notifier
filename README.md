# Uniswap Governance Enhancements 

A submission for [GR12 Bounty](https://gitcoin.co/issue/unigrants/ugp-hacks/8/100027229) by [Uniswap Grants](https://twitter.com/uniswapgrants)


# Uniswap Discord Notifications Bot

**Project Summary**

One of the main issues of governance process in Uniswap is the problem of *low liveness*. This project tries to increase community voting activity by introducing a Discord bot that sends notifications about ongoing votes. What this bot does is that it takes the blockchain log data from [Uniswap Governor Bravo](https://etherscan.io/address/0x408ED6354d4973f66138C91495F2f2FCbd8724C3) smart contract (using Moralis API), decodes them, and sends the corresponding notifications to your Discord channel. 

**Project Roadmap**

One major improvement to the current functionality would be a subscription feature that would allow users to enter their email to receive governance voting email updates. 

## Installation and configurations


1. Set up Discord bot: https://github.com/Joystream/community-repo/tree/master/contributions/research/discordbot
2. Create Moralis account: https://moralis.io
3. Clone and build the repo using `yarn && yarn build`
4. Run the bot using: `TOKEN=<DISCORD TOOKEN> MORALIS_API_KEY=<MORALIS API KEY> CHANNEL_ID=<DISCORD CHANNEL ID> yarn dev`

