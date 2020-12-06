const Migrations = artifacts.require("Migrations");
const Wikipedia = artifacts.require("Wikipedia");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Wikipedia);
};
