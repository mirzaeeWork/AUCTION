const hre = require("hardhat");

async function main() {

  const auction = await hre.ethers.deployContract("Action");

  await auction.waitForDeployment();

  console.log(
    `Action deployed to ${auction.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
