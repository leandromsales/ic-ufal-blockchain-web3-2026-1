const path = require('path');
const { execSync } = require('child_process');
const { getSignerFromEnv } = require('./lib/env-wallet');
const { updateEnvVar } = require('./lib/env-file');

function updateEnvContractAddress(address) {
  updateEnvVar('CONTRACT_ADDRESS', address);
}

function updateEnvProxyAddress(address) {
  updateEnvVar('PROXY_ADDRESS', address);
}

async function main() {
  const deployer = await getSignerFromEnv();
  console.log('Deployer (owner):', deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  if (balance === 0n) {
    throw new Error(
      `Carteira ${deployer.address} sem ETH nesta rede. ` +
        'Local: use PRIVATE_KEY da conta #0 do Hardhat node (veja .env.example) ou envie ETH para sua carteira no no.'
    );
  }

  const EtherTransfer = await ethers.getContractFactory('EtherTransfer');
  const contract = await EtherTransfer.connect(deployer).deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('EtherTransfer deployed at:', address);

  const TransferProxy = await ethers.getContractFactory('TransferProxy');
  const proxy = await TransferProxy.connect(deployer).deploy(address);

  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();
  console.log('TransferProxy deployed at:', proxyAddress);

  updateEnvContractAddress(address);
  updateEnvProxyAddress(proxyAddress);
  console.log('CONTRACT_ADDRESS e PROXY_ADDRESS atualizados no .env');

  execSync('npm run generate-config', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
