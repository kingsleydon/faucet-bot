const { WsProvider, ApiPromise } = require('@polkadot/api');
const pdKeyring = require('@polkadot/keyring');

const SUBSTRATE_ENDPOINT = process.env.SUBSTRATE_ENDPOINT || 'wss://westend-rpc.polkadot.io/';
const DECIMALS = parseInt(process.env.DECIMALS) || 15;

class Actions {
  async create(mnemonic, url = SUBSTRATE_ENDPOINT) {
    const provider = new WsProvider(url);
    this.api = await ApiPromise.create({ provider });
    const keyring = new pdKeyring.Keyring({ type: 'sr25519' });
    this.account = keyring.addFromMnemonic(mnemonic);
  }

  async sendDOTs(address, amount = 150) {
    amount = amount * 10**DECIMALS;

    const transfer = this.api.tx.balances.transfer(address, amount);
    const hash = await transfer.signAndSend(this.account);

    return hash.toHex();
  }

  async checkBalance() {
    if (this.api.query.balances.freeBalance) {
      return this.api.query.balances.freeBalance(this.account.address);
    } else {
      const accountInfo = await this.api.query.system.account(this.account.address);
      return accountInfo.data.free;
    }
  }
}

module.exports = Actions;
