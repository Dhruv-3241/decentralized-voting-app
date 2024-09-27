const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();  // Load environment variables from .env file

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"  // Match any network id for local development
    },
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,  // Metamask wallet mnemonic phrase
        `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`  // Infura project ID for Sepolia
      ),
      network_id: 11155111,  // Sepolia network ID
      gas: 5500000,  // Gas limit for deployment
      confirmations: 2,  // Number of confirmations to wait between deployments
      timeoutBlocks: 200,  // Timeout for the number of blocks
      skipDryRun: true  // Skip the dry run for public networks
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",  // Solidity compiler version
    }
  }
};
