/**
 * Carteira a partir de PRIVATE_KEY no .env, ou primeiro signer do Hardhat.
 *
 * Desenvolvimento local (localhost): PRIVATE_KEY e opcional — usa conta #0 do `hardhat node`.
 * Sepolia / MetaMask custom: defina PRIVATE_KEY valida no .env.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

function normalizePrivateKey(raw) {
  const key = raw?.trim();
  if (!key) return null;
  return key.startsWith('0x') ? key : `0x${key}`;
}

/** Chave privada valida (32 bytes hex) ou null se vazia/invalida. */
function resolvePrivateKey(raw) {
  const key = normalizePrivateKey(raw);
  if (!key) return null;
  return /^0x[0-9a-fA-F]{64}$/.test(key) ? key : null;
}

async function getSignerFromEnv() {
  const raw = process.env.PRIVATE_KEY?.trim();
  const privateKey = resolvePrivateKey(process.env.PRIVATE_KEY);
  const [defaultSigner] = await ethers.getSigners();

  if (!defaultSigner) {
    throw new Error('Nenhum signer disponivel. Inicie o no (npm run chain) para deploy local.');
  }

  if (raw && !privateKey) {
    console.warn(
      'AVISO: PRIVATE_KEY no .env e invalida (esperado 64 hex). Usando conta #0 do Hardhat.\n'
    );
  }

  if (privateKey) {
    return new ethers.Wallet(privateKey, defaultSigner.provider);
  }

  return defaultSigner;
}

module.exports = { normalizePrivateKey, resolvePrivateKey, getSignerFromEnv };
