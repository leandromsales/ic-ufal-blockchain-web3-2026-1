/**
 * Lê variáveis do .env na raiz (aula-3/.env)
 * e gera frontend/config.js com window.APP_CONFIG para o browser.
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const rootDir = path.join(__dirname, '..');
const envPath = path.join(rootDir, '.env');

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return dotenv.parse(fs.readFileSync(filePath, 'utf8'));
}

const env = readEnvFile(envPath);

const parsedLocalChainId = Number.parseInt(String(env.HARDHAT_LOCAL_CHAIN_ID ?? '31337').trim(), 10);
const parsedSepoliaChainId = Number.parseInt(String(env.SEPOLIA_CHAIN_ID ?? '11155111').trim(), 10);

const config = {
  CONTRACT_ADDRESS: (env.CONTRACT_ADDRESS ?? '').trim(),
  PROXY_ADDRESS: (env.PROXY_ADDRESS ?? '').trim(),
  TOKEN_ADDRESS: (env.TOKEN_ADDRESS ?? '').trim(),
  BLOCK_EXPLORER_ORIGIN: (env.BLOCK_EXPLORER_ORIGIN ?? '').trim(),
  BLOCK_EXPLORER_TX_PATH: (env.BLOCK_EXPLORER_TX_PATH ?? '/tx/{txHash}').trim(),
  BLOCK_EXPLORER_ADDRESS_PATH: (env.BLOCK_EXPLORER_ADDRESS_PATH ?? '/address/{address}').trim(),
  BLOCK_EXPLORER_TX_URL: (env.BLOCK_EXPLORER_TX_URL ?? '').trim(),
  HARDHAT_LOCAL_CHAIN_ID: Number.isFinite(parsedLocalChainId) ? parsedLocalChainId : 31337,
  SEPOLIA_CHAIN_ID: Number.isFinite(parsedSepoliaChainId) ? parsedSepoliaChainId : 11155111,
  LOCAL_RPC_URL: (env.LOCAL_RPC_URL ?? 'http://127.0.0.1:8545').trim(),
};

if (!config.CONTRACT_ADDRESS) {
  console.warn(
    'Aviso: CONTRACT_ADDRESS vazio em .env — defina o endereço do deploy e rode generate-config de novo.'
  );
}

const outPath = path.join(rootDir, 'frontend', 'config.js');
const body =
  '/* Gerado a partir de aula-3/.env — não edite; use npm run generate-config */\n' +
  `window.APP_CONFIG = ${JSON.stringify(config, null, 2)};\n`;

fs.writeFileSync(outPath, body, 'utf8');
console.log('frontend/config.js atualizado a partir de .env:', outPath);
if (config.CONTRACT_ADDRESS) {
  console.log('  CONTRACT_ADDRESS =', config.CONTRACT_ADDRESS);
}
if (config.PROXY_ADDRESS) {
  console.log('  PROXY_ADDRESS =', config.PROXY_ADDRESS);
}
if (config.TOKEN_ADDRESS) {
  console.log('  TOKEN_ADDRESS =', config.TOKEN_ADDRESS);
}
