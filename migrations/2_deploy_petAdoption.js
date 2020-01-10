var PetAdoption = artifacts.require("./PetAdoption.sol");

module.exports = function(deployer) {
  deployer.deploy(PetAdoption);
};
