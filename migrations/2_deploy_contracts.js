var Migrations=artifacts.require ("./Migrations.sol");
var Wikipedia=artifacts.require ("./Wikipedia.sol");

module.exports = function(deployer) {      
	deployer.deploy(Wikipedia);
	deployer.deploy(Migrations);
}