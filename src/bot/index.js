const axios = require('axios');
const pdKeyring = require('@polkadot/keyring');
require('dotenv').config()

const matrixBot = require('./matrix');
const telegramBot = require('./telegram');

const SYMBOL = process.env.SYMBOL || 'WND';
const DECIMALS = parseInt(process.env.DECIMALS) || 15;
const EXPLORER_URL = process.env.EXPLORER_URL || 'https://polkascan.io/pre/westend/transaction';

let ax = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 10000,
});

const ghost = {
  async balance (bot, args) {
    const res = await ax.get('/balance');
    const balance = res.data;
    bot.sendHtmlMessage(`The faucet has ${balance/10**DECIMALS} ${SYMBOL}s remaining.`, `The faucet has ${balance/10**DECIMALS} ${SYMBOL}s remaining.`)
  },
  async drip (bot, args) {
    try {
      pdKeyring.decodeAddress(args[0]);
    } catch (e) {
      bot.sendMessage(`${bot.sender} provided an incompatible address (${args[0]}).`);
      return;
    }

    let amount = 0.150;
    if (bot.sender.endsWith(':web3.foundation') && args[1]) {
      amount = args[1];
    }

    const res = await ax.post('/bot-endpoint', {
      sender: bot.sender,
      address: args[0],
      amount,
    });

    if (res.data === 'LIMIT') {
      bot.sendMessage(`${bot.sender} has reached their daily quota. Only request twice per 24 hours.`);
      return;
    }

    bot.sendHtmlMessage(
      `Sent ${bot.sender} ${amount*1000} m${SYMBOL}s. Extrinsic hash: ${res.data}.`,
      `Sent ${bot.sender} ${amount*1000} m${SYMBOL}s. <a href="${EXPLORER_URL}/${res.data}">View on Polkascan.</a>`
    );
  },
  async help (bot, args) {
    bot.sendMessage(
`Usage:
  ${bot.formatCommand('drip')} <Address> - Send ${SYMBOL}s to <Address>.
  ${bot.formatCommand('balance')} - Get the faucet's balance.
  ${bot.formatCommand('help')} - Prints usage information.`);
  }
};

matrixBot.start(ghost);
telegramBot.start(ghost);
