const DecentralizedVoting = artifacts.require("DecentralizedVoting");

module.exports = function(deployer) {
  deployer.deploy(DecentralizedVoting);
};