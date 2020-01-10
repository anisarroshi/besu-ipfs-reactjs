const path = require("path");
const PrivateKeyProvider = require("truffle-hdwallet-provider");
var privateKeys = [
  "1130ee5189f5626d11541266600bfe33473a4ba5d467778872a17fa76bcc0526",
  "37e59dbc50c67e73c4ce3741b63200db3f41dac9dd17fb99ac2fce65724169ee",
  "3b07903a721d33a73fa68be1ff534fd7cda8987331787a6df116d8657f215231",
];

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //    port: 8545,
    //    network_id: "*" // Match any network id
    //  },
     quickstartWallet: {
      provider: () => new PrivateKeyProvider(privateKeys, "http://173.193.92.125:30040"),
      network_id: "*"
    }
  }
};

