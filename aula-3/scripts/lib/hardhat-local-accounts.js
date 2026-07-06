/**
 * Deriva endereco e chave privada das contas padrao do `hardhat node` (local).
 *
 * O Hardhat pre-carrega 20 carteiras a partir de uma mnemonic fixa de desenvolvimento
 * (path BIP-44 `m/44'/60'/0'/0/N`). Este modulo reutiliza a mesma funcao interna
 * (`derivePrivateKeys`) para obter a conta #N sem precisar ler o no via RPC.
 *
 * Uso principal: `scripts/chain.js` grava a chave da #0 em PRIVATE_KEY no `.env`
 * ao rodar `npm run chain`, para deploy/admin local usarem a mesma carteira owner
 * exibida no terminal do Hardhat.
 */
const { derivePrivateKeys } = require('hardhat/internal/core/providers/util');
const {
  HARDHAT_NETWORK_MNEMONIC,
  defaultHardhatNetworkHdAccountsConfigParams,
} = require('hardhat/internal/core/config/default-config');
const { bytesToHex, privateToAddress } = require('@ethereumjs/util');

function toPrivateKeyHex(keyBytes) {
  const hex = bytesToHex(keyBytes);
  return hex.startsWith('0x') ? hex : `0x${hex}`;
}

function deriveAccountAt(index = 0) {
  const cfg = defaultHardhatNetworkHdAccountsConfigParams;
  const keys = derivePrivateKeys(
    cfg.mnemonic ?? HARDHAT_NETWORK_MNEMONIC,
    cfg.path,
    cfg.initialIndex + index,
    1,
    cfg.passphrase ?? ''
  );
  return keys[0];
}

/** Chave privada da conta #N do `hardhat node` (mesma derivacao interna do Hardhat). */
function getHardhatLocalPrivateKey(index = 0) {
  return toPrivateKeyHex(deriveAccountAt(index));
}

function getHardhatLocalAddress(index = 0) {
  const hex = bytesToHex(privateToAddress(deriveAccountAt(index)));
  return hex.startsWith('0x') ? hex : `0x${hex}`;
}

module.exports = { getHardhatLocalPrivateKey, getHardhatLocalAddress };
