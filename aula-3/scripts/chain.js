/**
 * Sincroniza PRIVATE_KEY (conta #0 do hardhat node) no .env e sobe o no.
 * Uso: npm run chain
 */
const { spawn } = require('child_process');
const path = require('path');
const { updateEnvVar } = require('./lib/env-file');
const { getHardhatLocalPrivateKey, getHardhatLocalAddress } = require('./lib/hardhat-local-accounts');

const ACCOUNT_INDEX = 0;
const privateKey = getHardhatLocalPrivateKey(ACCOUNT_INDEX);
const address = getHardhatLocalAddress(ACCOUNT_INDEX);

updateEnvVar('PRIVATE_KEY', privateKey);
console.log(
  `PRIVATE_KEY sincronizada no .env — conta Hardhat #${ACCOUNT_INDEX}: ${address}\n` +
    '(mesmas contas exibidas ao iniciar hardhat node)\n'
);

const rootDir = path.join(__dirname, '..');
const child = spawn('npx', ['hardhat', 'node'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
