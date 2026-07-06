require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

const { resolvePrivateKey } = require('./scripts/lib/env-wallet');

/** Sepolia exige carteira real; local usa conta #0 do `hardhat node` (sem PRIVATE_KEY). */
const sepoliaAccounts = resolvePrivateKey(process.env.PRIVATE_KEY);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.20',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
      // Sem `accounts`: Hardhat assina com as contas padrao do no (eth_accounts, #0, #1, …).
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/placeholder',
      chainId: 11155111,
      accounts: sepoliaAccounts ? [sepoliaAccounts] : [],
    },
  },
};
