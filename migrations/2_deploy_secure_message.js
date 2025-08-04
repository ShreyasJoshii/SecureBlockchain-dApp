const SecureMessage = artifacts.require("SecureMessage");

module.exports = function (deployer) {
  deployer.deploy(SecureMessage);
};
