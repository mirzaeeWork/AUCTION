require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require('solidity-coverage');


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.Infura_API_KEY}`,
      accounts: [process.env.Account_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.Polygon_ApiKey,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    // noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token:"MATIC"
  },

};
