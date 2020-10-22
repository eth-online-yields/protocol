import { ethers } from "@nomiclabs/buidler";

async function main() {
  const resolver = await ethers.getContractFactory("Resolver");
  //Whitelist accounts(0)
  const contract = await resolver.deploy(
    "0x00B8FBD65D61b7DFe34b9A3Bb6C81908d7fFD541"
  );

  console.log(contract.address);
  console.log(contract.deployTransaction.hash);
  await contract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
