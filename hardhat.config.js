require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  paths: {
    artifacts: "./src/artifacts"
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/ngABC3wIt249dDdjZIPN9l0z9dydTQal`,
      accounts: ['b69d343c46242e05438eded1a7e08d24bc83dddcd923806d36c01886dc19b101']
    }
  }
};
