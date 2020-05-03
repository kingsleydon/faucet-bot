#!/bin/bash

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

# Mnenonic of the account (sr25516)
export MNEMONIC='rail return lawsuit bachelor dash ozone way common tired trumpet similar glad'
# Substrate websocket endpoint
export SUBSTRATE_ENDPOINT=wss://poc1.phala.network/ws
# Port listend by 'src/server'
export PORT=5555
export WHITELISTED_USER_PREFIX=':web3.foundation'

# Get it from Riot (https://webapps.stackexchange.com/questions/131056/how-to-get-an-access-token-for-riot-matrix)
export MATRIX_ACCESS_TOKEN=
export MATRIX_USER_ID=@example:matrix.org

# Get it from @BotFather
export TELEGRAM_BOT_TOKEN=

# The endpoint of 'src/server'
export BACKEND_URL="http://127.0.0.1:${PORT}"
export SYMBOL=PHA
# Bot will send the url of a tx by "$EXPLORER_URL/$TXID"
export EXPLORER_URL=

# Decimals of the native token
export DECIMALS=12

# Finally start the daemons
node ./src/bot/index.js &
node ./src/server/index.js
