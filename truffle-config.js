module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 8545,            // Match Ganache CLI or GUI port
      network_id: "*",       // Accept any network ID
    },
  },

  compilers: {
    solc: {
      version: "0.8.21",     // Solidity compiler version
    },
  },

  mocha: {
    // timeout: 100000
  },

  // Truffle DB settings (disabled)
  // db: {
  //   enabled: false,
  // },
};
