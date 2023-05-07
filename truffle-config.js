
const Web3 = require('web3');


const PRIVATE_KEY = process.env.PRIVATE_KEY;

require("dotenv").config();
module.exports = {
  networks: {
    mantle_testnet: {
      network_id: "5001",
      chainId: 5001,
      port: 8545,
      url: "https://rpc.testnet.mantle.xyz/",
      accounts: [PRIVATE_KEY ?? "undefined"],
    },
  },
  compilers: {
    solc: {
      version: "0.8.4",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      },
    },
  },
}
