const APP_CONFIG = window.APP_CONFIG ?? {};
const CONTRACT_ADDRESS = (APP_CONFIG.CONTRACT_ADDRESS ?? '').trim();
const BLOCK_EXPLORER_ORIGIN = (APP_CONFIG.BLOCK_EXPLORER_ORIGIN ?? '').trim();
const BLOCK_EXPLORER_TX_PATH = (APP_CONFIG.BLOCK_EXPLORER_TX_PATH ?? '').trim();
const BLOCK_EXPLORER_ADDRESS_PATH = (APP_CONFIG.BLOCK_EXPLORER_ADDRESS_PATH ?? '').trim();
/** @deprecated use BLOCK_EXPLORER_ORIGIN + BLOCK_EXPLORER_TX_PATH */
const BLOCK_EXPLORER_TX_URL = (APP_CONFIG.BLOCK_EXPLORER_TX_URL ?? '').trim();
const HARDHAT_LOCAL_CHAIN_ID =
  Number.parseInt(String(APP_CONFIG.HARDHAT_LOCAL_CHAIN_ID ?? ''), 10) || 31337;
const SEPOLIA_CHAIN_ID =
  Number.parseInt(String(APP_CONFIG.SEPOLIA_CHAIN_ID ?? ''), 10) || 11155111;
const PROXY_ADDRESS = (APP_CONFIG.PROXY_ADDRESS ?? '').trim();
const TOKEN_ADDRESS = (APP_CONFIG.TOKEN_ADDRESS ?? '').trim();
const LOCAL_RPC_URL = (APP_CONFIG.LOCAL_RPC_URL ?? 'http://127.0.0.1:8545').trim();
const LIST_PAGE_SIZE = 10;
const FEE_PERCENT = 5;
const TRANSFER_ASSET = { ETH: 'eth', TOKEN: 'token' };

const TAB_IDS = {
  transfer: 'transfer',
  logs: 'logs',
  mine: 'mine',
  admin: 'admin',
};

const ADMIN_SUB_TAB = {
  ether: 'ether',
  token: 'token',
};

const ALL_TAB_IDS = [TAB_IDS.transfer, TAB_IDS.logs, TAB_IDS.mine, TAB_IDS.admin];

function chainIdToHex(chainId) {
  return `0x${Number(chainId).toString(16)}`;
}

const ABI = [
  {
    inputs: [{ internalType: 'address payable', name: 'to', type: 'address' }],
    name: 'transferEther',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getContractBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'enabled',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'wallet', type: 'address' }],
    name: 'getTransfersByOrigin',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'fee', type: 'uint256' },
        ],
        internalType: 'struct EtherTransfer.TransferRecord[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'wallet', type: 'address' }],
    name: 'getTransferCountByOrigin',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRegisteredWalletCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRegisteredWallets',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bool', name: 'newEnabled', type: 'bool' }],
    name: 'setEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'wallet', type: 'address' }],
    name: 'clearTransfersByOrigin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'wallet', type: 'address' },
      { internalType: 'uint256', name: 'keepLast', type: 'uint256' },
    ],
    name: 'pruneTransfersByOrigin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'clearAllTransfers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxRecordsPerWallet',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'newMax', type: 'uint256' }],
    name: 'setMaxRecordsPerWallet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address payable', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'withdrawFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address payable', name: 'to', type: 'address' }],
    name: 'withdrawAllFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'bool', name: 'enabled', type: 'bool' }],
    name: 'OperationsStatusChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'fee', type: 'uint256' },
    ],
    name: 'TransferExecuted',
    type: 'event',
  },
];

const PROXY_ABI = [
  {
    inputs: [{ internalType: 'address payable', name: 'to', type: 'address' }],
    name: 'proxyTransfer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

const TOKEN_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'weiPerToken',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenAmount', type: 'uint256' }],
    name: 'ethValueOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'newWeiPerToken', type: 'uint256' }],
    name: 'setEthRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

let provider;
let signer;
let contract;
let proxyContract;
let tokenContract;
let readOnlyProvider;
let readOnlyContract;
let readOnlyTokenContract;
let tokenSymbol = 'AULA';
let tokenName = 'Aula Token';
let tokenWeiPerToken = null;
let transferLogs = [];
let highlightedLogTxHashes = new Set();
const LOG_HIGHLIGHT_MS = 4500;
let logsListenerContract = null;
let contractEventsListener = null;
let ethUsdPrice = null;
let ethUsdPriceFetchedAt = 0;
let connectedWalletAddress = null;
let contractOwnerAddress = null;
let activeTabId = 'transfer';
let activeAdminSubTab = ADMIN_SUB_TAB.ether;
let adminSelectedWallet = null;
let adminToggleSyncing = false;
let adminWalletEntries = [];
let contractOperationsEnabled = true;
let currentChainId = null;
let logsFilterAddress = '';
let logsPage = 0;
let mineFilterAddress = '';
let minePage = 0;
let myTransfersCache = [];
const ETH_USD_PRICE_TTL_MS = 30_000;

const ICON_COPY = `<svg class="icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;

function normalizeChainId(chainId) {
  if (chainId == null) return NaN;
  if (typeof chainId === 'number' && Number.isFinite(chainId)) return chainId;
  if (typeof chainId === 'string') {
    if (chainId.startsWith('0x') || chainId.startsWith('0X')) return parseInt(chainId, 16);
    return parseInt(chainId, 10);
  }
  if (typeof chainId?.toNumber === 'function') return chainId.toNumber();
  return Number(chainId);
}

function isQueryFlagEnabled(paramName) {
  const raw = new URLSearchParams(window.location.search).get(paramName);
  if (raw == null || raw === '') return false;
  return ['1', 'true', 'yes', 'on'].includes(String(raw).trim().toLowerCase());
}

function getInjectableProvider() {
  const { ethereum } = window;
  if (!ethereum) return null;
  const list = ethereum.providers;
  if (Array.isArray(list) && list.length > 0) return list.find((p) => p.isMetaMask) ?? list[0];
  return ethereum;
}

function setWalletUi(text) {
  connectedWalletAddress = null;
  const el = document.getElementById('wallet');
  if (!el) return;
  el.textContent = text ?? '';
}

function setWalletUiConnected(address, chainId, chainLabel) {
  connectedWalletAddress = address;
  const el = document.getElementById('wallet');
  if (!el) return;

  el.innerHTML =
    `<div class="wallet-connected">` +
    `<div class="wallet-connected-row">` +
    `<span class="wallet-connected-addr">${address}</span>` +
    `<button type="button" class="btn-icon-inline btn-icon-inline--on-dark" id="btn-copy-wallet-address" title="Copiar endereço" aria-label="Copiar endereço">${ICON_COPY}</button>` +
    `</div>` +
    `<span class="wallet-connected-chain">Chain ID ${chainId} ${chainLabel}</span>` +
    `</div>`;

  document
    .getElementById('btn-copy-wallet-address')
    ?.addEventListener('click', copyConnectedWalletAddress);
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

async function copyConnectedWalletAddress() {
  if (!connectedWalletAddress) return;
  await copyTextToClipboard(connectedWalletAddress);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(message, { type = 'info', duration = 4500 } = {}) {
  const root = document.getElementById('toast-root');
  if (!root || !message) return;

  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.textContent = message;
  root.appendChild(el);

  window.setTimeout(() => {
    el.remove();
  }, duration);
}

function getNetworkLabel(chainId) {
  const id = normalizeChainId(chainId);
  if (id === HARDHAT_LOCAL_CHAIN_ID) return { label: 'Hardhat local', variant: 'local' };
  if (id === SEPOLIA_CHAIN_ID) return { label: 'Sepolia', variant: 'sepolia' };
  return { label: `Chain ${id}`, variant: 'unknown' };
}

function updateNetworkBadge(chainId) {
  const el = document.getElementById('network-badge');
  if (!el) return;

  if (chainId == null || Number.isNaN(normalizeChainId(chainId))) {
    el.textContent = 'Rede: —';
    el.className = 'network-badge network-badge--unknown';
    return;
  }

  const { label, variant } = getNetworkLabel(chainId);
  el.textContent = `Rede: ${label}`;
  el.className = `network-badge network-badge--${variant}`;
}

function setHealthBanner(message) {
  const el = document.getElementById('health-banner');
  if (!el) return;
  if (!message) {
    el.hidden = true;
    el.textContent = '';
    return;
  }
  el.hidden = false;
  el.textContent = message;
}

async function runHealthCheck() {
  if (typeof ethers === 'undefined' || !ethers.utils.isAddress(CONTRACT_ADDRESS)) {
    setHealthBanner('CONTRACT_ADDRESS não configurado. Rode npm run deploy:local e generate-config.');
    return false;
  }

  const balanceProvider = getBalanceProvider();
  if (!balanceProvider) {
    setHealthBanner('');
    return true;
  }

  try {
    const bytecode = await balanceProvider.getCode(CONTRACT_ADDRESS);
    if (!bytecode || bytecode === '0x') {
      const net = currentChainId != null ? getNetworkLabel(currentChainId).label : 'atual';
      setHealthBanner(
        `Nenhum contrato em ${CONTRACT_ADDRESS} na rede ${net}. Verifique deploy e rede da MetaMask.`
      );
      return false;
    }
    setHealthBanner('');
    return true;
  } catch {
    setHealthBanner('Não foi possível verificar o contrato na rede atual.');
    return false;
  }
}

function applyOperationsEnabledState(enabled) {
  contractOperationsEnabled = Boolean(enabled);
  const banner = document.getElementById('operations-suspended-banner');
  if (banner) banner.hidden = contractOperationsEnabled;
  updateAdminAccordionMeta({ enabled: contractOperationsEnabled });
  syncTransferFormAvailability();
}

function syncTransferFormAvailability() {
  const walletReady = Boolean(signer);
  const tokenMode = isTokenTransferMode();
  const ethReady = Boolean(contract && signer);
  const tokenReady = Boolean(tokenContract && signer);
  const opsEnabled = contractOperationsEnabled;
  const on = walletReady && (tokenMode ? tokenReady : ethReady && opsEnabled);

  document.getElementById('input-to-address').disabled = !on;
  document.getElementById('input-amount-eth').disabled = !on;
  document.getElementById('btn-transfer').disabled = !on;
  document.getElementById('btn-refresh-destination-balance').disabled = !on;
  document.getElementById('btn-transfer-amount-max').disabled = !on;
  document.getElementById('btn-transfer-via-proxy').disabled =
    !on || !proxyContract || tokenMode;
  setTransferAssetRadiosEnabled(Boolean(signer));
  updateWatchTokenButton();
}

function updateWatchTokenButton() {
  const btn = document.getElementById('btn-watch-token');
  if (!btn) return;

  const tokenAvailable =
    ethers.utils.isAddress(TOKEN_ADDRESS) && Boolean(getTokenContract() || readOnlyTokenContract);
  const canWatch = Boolean(window.ethereum) && Boolean(signer) && tokenAvailable;

  btn.disabled = !canWatch;
  btn.title = `Adicionar ${tokenSymbol} ao MetaMask (wallet_watchAsset, EIP-747)`;
}

async function addTokenToMetaMask() {
  if (!window.ethereum) {
    showToast('MetaMask não encontrada.', { type: 'error' });
    return;
  }
  if (!isWalletConnected()) {
    showToast('Conecte a carteira primeiro.', { type: 'error' });
    return;
  }
  if (!ethers.utils.isAddress(TOKEN_ADDRESS)) {
    showToast('TOKEN_ADDRESS não configurado. Rode npm run deploy:local.', { type: 'error' });
    return;
  }

  const c = getTokenContract() || readOnlyTokenContract;
  if (!c) {
    showToast('Token indisponível nesta rede.', { type: 'error' });
    return;
  }

  try {
    const [symbol, decimals] = await Promise.all([c.symbol(), c.decimals()]);
    const added = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: TOKEN_ADDRESS,
          symbol,
          decimals: Number(decimals),
        },
      },
    });

    if (added) {
      showToast(`${symbol} adicionado ao MetaMask.`, { type: 'success' });
    } else {
      showToast('MetaMask não adicionou o token (cancelado ou recusado).', { type: 'info' });
    }
  } catch (err) {
    if (err?.code === 4001) {
      showToast('Pedido cancelado na MetaMask.', { type: 'info' });
      return;
    }
    showToast(friendlyContractError(err), { type: 'error' });
  }
}

function computeTransferBreakdown(totalEth) {
  if (!totalEth || Number(totalEth) <= 0) return null;
  try {
    const totalWei = ethers.utils.parseEther(String(totalEth));
    const feeWei = totalWei.mul(FEE_PERCENT).div(100);
    const netWei = totalWei.sub(feeWei);
    return {
      totalWei,
      feeWei,
      netWei,
      totalEth: ethers.utils.formatEther(totalWei),
      feeEth: ethers.utils.formatEther(feeWei),
      netEth: ethers.utils.formatEther(netWei),
    };
  } catch {
    return null;
  }
}

function renderTransferPreview() {
  const el = document.getElementById('transfer-preview');
  if (!el) return;

  const amountRaw = document.getElementById('input-amount-eth')?.value.trim() ?? '';

  if (isTokenTransferMode()) {
    if (!amountRaw || Number(amountRaw) <= 0) {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    try {
      const tokenWei = ethers.utils.parseEther(amountRaw);
      const ethRef =
        tokenWeiPerToken != null
          ? ethers.utils.formatEther(tokenWei.mul(tokenWeiPerToken).div(ethers.constants.WeiPerEther))
          : null;
      el.hidden = false;
      el.innerHTML =
        `<dl>` +
        `<div><dt>Total enviado</dt><dd>${escapeHtml(amountRaw)} ${escapeHtml(tokenSymbol)}</dd></div>` +
        (ethRef
          ? `<div><dt>Referência em ETH</dt><dd>≈ ${escapeHtml(ethRef)} ETH (cotação on-chain)</dd></div>`
          : '') +
        `</dl>`;
    } catch {
      el.hidden = true;
      el.innerHTML = '';
    }
    return;
  }

  const breakdown = computeTransferBreakdown(amountRaw);
  if (!breakdown) {
    el.hidden = true;
    el.innerHTML = '';
    return;
  }

  el.hidden = false;
  el.innerHTML =
    `<dl>` +
    `<div><dt>Total enviado (msg.value)</dt><dd>${escapeHtml(breakdown.totalEth)} ETH</dd></div>` +
    `<div><dt>Taxa (${FEE_PERCENT}%)</dt><dd>${escapeHtml(breakdown.feeEth)} ETH</dd></div>` +
    `<div><dt>Líquido ao destino</dt><dd>${escapeHtml(breakdown.netEth)} ETH</dd></div>` +
    `</dl>`;
}

function normalizeFilterAddress(raw) {
  const value = String(raw ?? '').trim();
  if (!value) return '';
  return ethers.utils.isAddress(value) ? value : '';
}

function paginateItems(items, page) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / LIST_PAGE_SIZE));
  const safePage = Math.min(Math.max(0, page), totalPages - 1);
  const start = safePage * LIST_PAGE_SIZE;
  return {
    page: safePage,
    totalPages,
    total,
    slice: items.slice(start, start + LIST_PAGE_SIZE),
  };
}

function updatePaginationUi({ pageInfoId, prevId, nextId, page, totalPages, total }) {
  const info = document.getElementById(pageInfoId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if (info) {
    info.textContent =
      total === 0 ? '0 itens' : `Pág. ${page + 1}/${totalPages} · ${total} item(ns)`;
  }
  if (prev) prev.disabled = page <= 0;
  if (next) next.disabled = page >= totalPages - 1;
}

function buildExplorerUrl(pathTemplate, replacements) {
  if (!BLOCK_EXPLORER_ORIGIN || !pathTemplate) return null;
  const origin = BLOCK_EXPLORER_ORIGIN.replace(/\/$/, '');
  let path = pathTemplate;
  for (const [key, value] of Object.entries(replacements)) {
    if (value == null) continue;
    path = path.replace(new RegExp(`\\{${key}\\}`, 'gi'), String(value));
  }
  if (!path.startsWith('/')) path = `/${path}`;
  return `${origin}${path}`;
}

function buildTxExplorerUrl(txHash) {
  if (!txHash) return null;
  if (BLOCK_EXPLORER_ORIGIN && BLOCK_EXPLORER_TX_PATH) {
    return buildExplorerUrl(BLOCK_EXPLORER_TX_PATH, { txHash, hash: txHash });
  }
  if (BLOCK_EXPLORER_TX_URL) {
    return BLOCK_EXPLORER_TX_URL.replace(/\{txHash\}/gi, txHash).replace(/\{hash\}/gi, txHash);
  }
  return null;
}

function buildAddressExplorerUrl(address) {
  if (!address) return null;
  if (BLOCK_EXPLORER_ORIGIN && BLOCK_EXPLORER_ADDRESS_PATH) {
    return buildExplorerUrl(BLOCK_EXPLORER_ADDRESS_PATH, { address, addr: address });
  }
  return null;
}

function explorerLink(url, label, className = 'log-explorer-link') {
  const text = label ?? '';
  if (!url) return escapeHtml(text);
  return (
    `<a class="${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">` +
    `${escapeHtml(text)}</a>`
  );
}

function setTransferOutput(text) {
  const el = document.getElementById('transfer-output');
  if (!el) return;
  el.className = 'output';
  if (!text) {
    el.innerHTML = '';
    return;
  }
  el.textContent = text;
}

function setTransferPending(txHash) {
  const el = document.getElementById('transfer-output');
  if (!el) return;
  const explorerUrl = buildTxExplorerUrl(txHash);
  const txLine = explorerUrl
    ? `<a class="transfer-result__link" href="${escapeHtml(
        explorerUrl
      )}" target="_blank" rel="noopener noreferrer">${escapeHtml(txHash)}</a>`
    : `<span class="transfer-result__hash">${escapeHtml(txHash)}</span>`;

  el.className = 'output';
  el.innerHTML =
    `<div class="transfer-result transfer-result--pending">` +
    `<p class="transfer-result__status">Transação enviada. Aguardando confirmação…</p>` +
    `<p class="transfer-result__tx">${txLine}</p>` +
    `</div>`;
}

function renderTransferEventDetails(eventLog) {
  if (!eventLog || !isValidTransferLogEntry(eventLog)) return '';
  const from = String(eventLog.from);
  const to = String(eventLog.to);
  const valueEth = formatEthShort(eventLog.value);
  const feeEth = formatEthShort(eventLog.fee);
  return (
    `<div class="transfer-result__event">` +
    `<p class="transfer-result__tx-label">Evento TransferExecuted</p>` +
    `<dl class="transfer-result__event-grid">` +
    `<div><dt>De</dt><dd>${explorerLink(
      buildAddressExplorerUrl(from),
      from,
      'transfer-result__link'
    )}</dd></div>` +
    `<div><dt>Para</dt><dd>${explorerLink(
      buildAddressExplorerUrl(to),
      to,
      'transfer-result__link'
    )}</dd></div>` +
    `<div><dt>Valor líquido</dt><dd>${escapeHtml(valueEth)} ETH</dd></div>` +
    `<div><dt>Taxa (5%)</dt><dd>${escapeHtml(feeEth)} ETH</dd></div>` +
    `<div><dt>Bloco</dt><dd>#${logBlockNumber(eventLog.blockNumber)}</dd></div>` +
    `</dl>` +
    `</div>`
  );
}

function setTransferSuccess(txHash, { eventLog = null } = {}) {
  const el = document.getElementById('transfer-output');
  if (!el) return;
  const explorerUrl = buildTxExplorerUrl(txHash);
  const txLine = explorerUrl
    ? `<a class="transfer-result__link" href="${escapeHtml(
        explorerUrl
      )}" target="_blank" rel="noopener noreferrer">${escapeHtml(txHash)}</a>`
    : `<span class="transfer-result__hash">${escapeHtml(txHash)}</span>`;
  const eventBlock = renderTransferEventDetails(eventLog);
  const hint = eventLog
    ? ''
    : '<p class="transfer-result__hint">Evento TransferExecuted não encontrado no receipt — veja a aba Logs.</p>';

  el.className = 'output';
  el.innerHTML =
    `<div class="transfer-result transfer-result--success">` +
    `<p class="transfer-result__title" role="status">✓ Transferência concluída!</p>` +
    `<p class="transfer-result__tx-label">Transação</p>` +
    `<p class="transfer-result__tx">${txLine}</p>` +
    eventBlock +
    hint +
    `</div>`;
}

function setAddressBalanceOutput(content, asHtml = false) {
  const el = document.getElementById('address-balance-output');
  if (!el) return;
  if (!content) {
    el.innerHTML = '';
    return;
  }
  if (asHtml) {
    el.innerHTML = content;
    return;
  }
  el.textContent = content;
}

function formatEthShort(balanceWei) {
  const n = parseFloat(ethers.utils.formatEther(balanceWei));
  if (!Number.isFinite(n)) return '0,00';
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatEthFull(balanceWei) {
  return ethers.utils.formatEther(balanceWei);
}

async function fetchEthUsdPrice(force = false) {
  const now = Date.now();
  if (!force && ethUsdPrice != null && now - ethUsdPriceFetchedAt < ETH_USD_PRICE_TTL_MS) {
    return ethUsdPrice;
  }

  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Cotação ETH/USD indisponível');

  const data = await res.json();
  const price = data?.ethereum?.usd;
  if (typeof price !== 'number') throw new Error('Cotação ETH/USD inválida');

  ethUsdPrice = price;
  ethUsdPriceFetchedAt = now;
  return ethUsdPrice;
}

function formatUsdFull(balanceWei) {
  if (ethUsdPrice == null) return null;

  const eth = parseFloat(ethers.utils.formatEther(balanceWei));
  if (!Number.isFinite(eth)) return null;

  const usd = eth * ethUsdPrice;
  return usd.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

const BALANCE_TOOLTIP_BY_VALUE_ID = {
  'contract-balance-value': 'contract-balance-tooltip',
  'wallet-balance-value': 'wallet-balance-tooltip',
  'token-balance-value': 'token-balance-tooltip',
};

function getTransferAsset() {
  const tokenRadio = document.getElementById('transfer-asset-token');
  if (tokenRadio?.checked) return TRANSFER_ASSET.TOKEN;
  return TRANSFER_ASSET.ETH;
}

function isTokenTransferMode() {
  return getTransferAsset() === TRANSFER_ASSET.TOKEN;
}

function getTokenContract() {
  return tokenContract ?? readOnlyTokenContract ?? null;
}

function formatTokenAmount(balanceWei) {
  return `${formatEthShort(balanceWei)} ${tokenSymbol}`;
}

function syncTransferAssetUi() {
  const ethRadio = document.getElementById('transfer-asset-eth');
  const tokenRadio = document.getElementById('transfer-asset-token');
  const amountLabel = document.getElementById('transfer-amount-label');
  const proxySection = document.getElementById('transfer-proxy-section');
  const rateHint = document.getElementById('token-rate-hint');
  const tokenMode = isTokenTransferMode();

  if (amountLabel) {
    amountLabel.textContent = tokenMode ? `Valor (${tokenSymbol})` : 'Valor (ETH)';
  }
  if (proxySection) proxySection.hidden = tokenMode;
  if (rateHint) rateHint.hidden = !tokenMode || !tokenWeiPerToken;
  renderTransferPreview();
}

function updateTokenRateDisplay() {
  const display = document.getElementById('token-rate-display');
  if (!display) return;
  if (!tokenWeiPerToken) {
    display.textContent = '—';
    return;
  }
  display.textContent = `1 ${tokenSymbol} ≈ ${ethers.utils.formatEther(tokenWeiPerToken)} ETH`;
}

async function refreshTokenMetadata() {
  const c = getTokenContract();
  if (!c) return;

  try {
    const [name, symbol, weiPerToken] = await Promise.all([c.name(), c.symbol(), c.weiPerToken()]);
    tokenName = name;
    tokenSymbol = symbol;
    tokenWeiPerToken = weiPerToken;
    const label = document.getElementById('transfer-asset-token-label');
    if (label) label.textContent = `Token (${tokenSymbol})`;
    const adminTokenTab = document.getElementById('admin-tab-token');
    if (adminTokenTab) adminTokenTab.textContent = `SimpleToken (${tokenSymbol})`;
    updateTokenRateDisplay();
    syncTransferAssetUi();
    updateWatchTokenButton();
  } catch {
    // Mantém defaults se a rede não tiver o token deployado.
  }
}

function renderTokenBalanceChip(balanceWei) {
  const el = document.getElementById('token-balance-value');
  if (!el) return;
  el.textContent = formatTokenAmount(balanceWei);
  const tooltipId = BALANCE_TOOLTIP_BY_VALUE_ID['token-balance-value'];
  if (tooltipId) {
    const ethRef =
      tokenWeiPerToken && tokenContract?.ethValueOf
        ? `≈ ${ethers.utils.formatEther(balanceWei.mul(tokenWeiPerToken).div(ethers.constants.WeiPerEther))} ETH (cotação)`
        : '';
    setBalanceTooltip(tooltipId, `${ethers.utils.formatEther(balanceWei)} ${tokenSymbol}${ethRef ? `\n${ethRef}` : ''}`);
  }
}

async function showTokenBalance() {
  const c = getTokenContract();
  if (!c || !signer) {
    setBalanceChipPlaceholder('token-balance-value', '—');
    return;
  }

  try {
    const address = await signer.getAddress();
    const balanceWei = await c.balanceOf(address);
    renderTokenBalanceChip(balanceWei);
  } catch {
    setBalanceChipPlaceholder('token-balance-value', '—');
  }
}

async function bindTokenContract() {
  tokenContract = null;
  if (!signer || !provider || !ethers.utils.isAddress(TOKEN_ADDRESS)) return;

  try {
    const bytecode = await provider.getCode(TOKEN_ADDRESS);
    if (!bytecode || bytecode === '0x') return;
    tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
    await refreshTokenMetadata();
    syncAdminTokenPanelAvailability();
  } catch {
    tokenContract = null;
  }
}

async function initReadOnlyToken() {
  readOnlyTokenContract = null;
  if (!ethers.utils.isAddress(TOKEN_ADDRESS)) {
    setBalanceChipPlaceholder('token-balance-value', '—');
    return;
  }

  try {
    const rpc = readOnlyProvider ?? new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
    const bytecode = await rpc.getCode(TOKEN_ADDRESS);
    if (!bytecode || bytecode === '0x') {
      setBalanceChipPlaceholder('token-balance-value', '—');
      return;
    }
    readOnlyTokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, rpc);
    await refreshTokenMetadata();
    syncAdminTokenPanelAvailability();
    if (signer) {
      await showTokenBalance();
    } else {
      setBalanceChipPlaceholder('token-balance-value', '—');
    }
  } catch {
    setBalanceChipPlaceholder('token-balance-value', '—');
  }
}

function setTransferAssetRadiosEnabled(enabled) {
  document.getElementById('transfer-asset-eth')?.toggleAttribute('disabled', !enabled);
  const tokenEnabled = enabled && Boolean(getTokenContract());
  document.getElementById('transfer-asset-token')?.toggleAttribute('disabled', !tokenEnabled);
  if (!tokenEnabled) {
    const ethRadio = document.getElementById('transfer-asset-eth');
    if (ethRadio) ethRadio.checked = true;
    syncTransferAssetUi();
  }
}

function buildBalanceDetailText(balanceWei) {
  const lines = [`${formatEthFull(balanceWei)} ETH`];
  const usdFull = formatUsdFull(balanceWei);
  if (usdFull) lines.push(`${usdFull} (CoinGecko)`);
  return lines.join('\n');
}

function setBalanceTooltip(tooltipId, text) {
  const tip = document.getElementById(tooltipId);
  if (!tip) return;
  if (!text) {
    tip.textContent = '';
    tip.hidden = true;
    return;
  }
  tip.textContent = text;
  tip.hidden = false;
}

function renderEthBalanceChip(valueElementId, balanceWei) {
  const el = document.getElementById(valueElementId);
  if (!el) return;

  el.textContent = `${formatEthShort(balanceWei)} ETH`;
  const tooltipId = BALANCE_TOOLTIP_BY_VALUE_ID[valueElementId];
  if (tooltipId) setBalanceTooltip(tooltipId, buildBalanceDetailText(balanceWei));
}

function renderContractBalanceChip(balanceWei) {
  renderEthBalanceChip('contract-balance-value', balanceWei);
}

function renderWalletBalanceChip(balanceWei) {
  renderEthBalanceChip('wallet-balance-value', balanceWei);
}

function setBalanceChipPlaceholder(elementId, text) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = text;
  const tooltipId = BALANCE_TOOLTIP_BY_VALUE_ID[elementId];
  if (tooltipId) setBalanceTooltip(tooltipId, '');
}

function setTransferActionsEnabled(on) {
  if (!on) {
    document.getElementById('input-to-address').disabled = true;
    document.getElementById('input-amount-eth').disabled = true;
    document.getElementById('btn-transfer').disabled = true;
    document.getElementById('btn-refresh-destination-balance').disabled = true;
    document.getElementById('btn-transfer-amount-max').disabled = true;
    document.getElementById('btn-transfer-via-proxy').disabled = true;
    return;
  }
  syncTransferFormAvailability();
}

const TRANSFER_GAS_LIMIT_BUFFER_BPS = 11500; // +15% sobre o gas estimado

async function estimateTransferGasCostWei(to, from, valueWei) {
  const gasLimit = await contract.estimateGas.transferEther(to, {
    from,
    value: valueWei,
  });
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.maxFeePerGas ?? feeData.gasPrice;
  if (!gasPrice) {
    throw new Error('Não foi possível obter o preço do gas na rede atual.');
  }
  const bufferedGasLimit = gasLimit.mul(TRANSFER_GAS_LIMIT_BUFFER_BPS).div(10000);
  return bufferedGasLimit.mul(gasPrice);
}

async function computeMaxTransferValueWei(address, to) {
  const balanceWei = await provider.getBalance(address);
  if (balanceWei.isZero()) {
    return { balanceWei, maxWei: null, reason: 'zero' };
  }

  const sampleValue = balanceWei.gt(ethers.utils.parseEther('0.001'))
    ? ethers.utils.parseEther('0.001')
    : balanceWei;

  let gasCostWei = await estimateTransferGasCostWei(to, address, sampleValue);
  let maxWei = balanceWei.sub(gasCostWei);

  if (maxWei.gt(0)) {
    try {
      const refinedGasCost = await estimateTransferGasCostWei(to, address, maxWei);
      maxWei = balanceWei.sub(refinedGasCost);
    } catch {
      // Mantém a estimativa inicial se a refinada falhar (ex.: valor ainda alto demais).
    }
  }

  if (maxWei.lte(0)) {
    return { balanceWei, maxWei: null, reason: 'gas' };
  }

  return { balanceWei, maxWei, reason: null };
}

async function fillTransferAmountWithMax() {
  if (!signer || !provider) {
    showToast('Conecte a carteira primeiro.', { type: 'error' });
    return;
  }

  const input = document.getElementById('input-amount-eth');
  if (!input) return;

  if (isTokenTransferMode()) {
    if (!tokenContract) {
      showToast('Token indisponível na rede atual. Rode npm run deploy:local.', { type: 'error' });
      return;
    }
    try {
      const address = await signer.getAddress();
      const balanceWei = await tokenContract.balanceOf(address);
      if (balanceWei.isZero()) {
        showToast(`Saldo de ${tokenSymbol} é zero. Peça ao admin para mintar tokens.`, {
          type: 'error',
        });
        return;
      }
      input.value = ethers.utils.formatEther(balanceWei);
      renderTransferPreview();
    } catch (err) {
      showToast(friendlyContractError(err), { type: 'error' });
    }
    return;
  }

  if (!contract) {
    showToast('Contrato indisponível na rede atual. Verifique o deploy e a rede da carteira.', {
      type: 'error',
    });
    return;
  }

  try {
    const address = await signer.getAddress();
    const destination = getDestinationAddress();
    const to = isValidDestinationAddress(destination) ? destination : address;

    const { maxWei, reason } = await computeMaxTransferValueWei(address, to);
    if (reason === 'zero') {
      showToast('O saldo da carteira é zero.', { type: 'error' });
      return;
    }
    if (reason === 'gas' || !maxWei) {
      showToast('Saldo insuficiente para cobrir o gas estimado desta transação.', { type: 'error' });
      return;
    }

    input.value = ethers.utils.formatEther(maxWei);
    renderTransferPreview();
  } catch (err) {
    showToast(friendlyContractError(err), { type: 'error' });
  }
}

function getDestinationAddress() {
  return document.getElementById('input-to-address')?.value.trim() ?? '';
}

function isValidDestinationAddress(address) {
  return typeof ethers !== 'undefined' && ethers.utils.isAddress(address);
}

function onDestinationAddressFocus() {
  const to = getDestinationAddress();
  if (isValidDestinationAddress(to)) showAddressBalance();
}

function onDestinationAddressChange() {
  const to = getDestinationAddress();
  if (!to) {
    setAddressBalanceOutput('');
    return;
  }
  if (isValidDestinationAddress(to)) {
    showAddressBalance();
  }
}

function onDestinationAddressBlur() {
  const to = getDestinationAddress();
  if (!to) {
    setAddressBalanceOutput('');
    return;
  }
  if (!isValidDestinationAddress(to)) {
    setAddressBalanceOutput('Informe um endereço válido para consultar o saldo.');
    return;
  }
  showAddressBalance();
}

function initDestinationAddressField() {
  const input = document.getElementById('input-to-address');
  input?.addEventListener('focus', onDestinationAddressFocus);
  input?.addEventListener('input', onDestinationAddressChange);
  input?.addEventListener('blur', onDestinationAddressBlur);
  document
    .getElementById('btn-refresh-destination-balance')
    ?.addEventListener('click', () => showAddressBalance());
  document
    .getElementById('btn-transfer-amount-max')
    ?.addEventListener('click', () => fillTransferAmountWithMax());
  document.getElementById('input-amount-eth')?.addEventListener('input', renderTransferPreview);
}

function isWalletConnected() {
  return Boolean(signer && provider);
}

function updateConnectButton() {
  const btn = document.getElementById('btn-connect');
  if (!btn) return;
  const connected = isWalletConnected();
  btn.textContent = connected ? 'Disconnect' : 'Connect Wallet';
  btn.classList.toggle('btn-connect--connected', connected);
}

function clearTransferForm() {
  document.getElementById('transfer-form')?.reset();
  setTransferOutput('');
  setAddressBalanceOutput('');
}

function setNetworkStatusUi(text) {
  const el = document.getElementById('network-status');
  if (el) el.innerText = text;
}

function friendlyWalletError(err) {
  const code = Number(err?.code);
  if (code === 4001) return 'Conexão recusada na carteira.';
  if (code === 4100) return 'Carteira não autorizou esta ação.';
  if (err?.code === -32002) return 'Já existe uma solicitação pendente na MetaMask.';
  return err?.message || err?.reason || 'Erro ao conectar carteira.';
}

function friendlyContractError(err) {
  return err?.reason || err?.message || 'Erro ao chamar o contrato.';
}

function isValidTransferLogEntry(entry) {
  return (
    entry &&
    entry.txHash &&
    entry.from &&
    entry.to &&
    entry.value != null &&
    entry.fee != null &&
    entry.blockNumber != null
  );
}

function buildTransferLogEntry(args, meta) {
  const a = args ?? [];
  const entry = {
    txHash: meta.txHash,
    blockNumber: meta.blockNumber,
    from: a.from ?? a[0],
    to: a.to ?? a[1],
    value: a.value ?? a[2],
    fee: a.fee ?? a[3],
  };
  return isValidTransferLogEntry(entry) ? entry : null;
}

function parseTransferExecutedFromLog(contractInstance, log, receipt) {
  try {
    const parsed = contractInstance.interface.parseLog(log);
    if (parsed.name !== 'TransferExecuted') return null;
    return buildTransferLogEntry(parsed.args, {
      txHash: log.transactionHash ?? receipt?.transactionHash,
      blockNumber: log.blockNumber ?? receipt?.blockNumber,
    });
  } catch {
    return null;
  }
}

function ingestTransferExecutedFromReceipt(receipt, contractInstance) {
  const contractAddr = CONTRACT_ADDRESS.toLowerCase();

  const fromReceipt = receipt.events?.find((e) => e.event === 'TransferExecuted');
  if (fromReceipt) {
    const entry = buildTransferLogEntry(fromReceipt.args, {
      txHash: fromReceipt.transactionHash ?? receipt.transactionHash,
      blockNumber: fromReceipt.blockNumber ?? receipt.blockNumber,
    });
    if (entry) {
      upsertTransferLog(entry);
      return entry;
    }
  }

  for (const log of receipt.logs ?? []) {
    if (log.address && log.address.toLowerCase() !== contractAddr) continue;
    const entry = parseTransferExecutedFromLog(contractInstance, log, receipt);
    if (entry) {
      upsertTransferLog(entry);
      return entry;
    }
  }
  return null;
}

function getLogsContract() {
  const balanceProvider = getBalanceProvider();
  if (!balanceProvider || !ethers.utils.isAddress(CONTRACT_ADDRESS)) return null;
  return (
    contract ?? readOnlyContract ?? new ethers.Contract(CONTRACT_ADDRESS, ABI, balanceProvider)
  );
}

async function fetchTransferExecutedLogs(contractInstance) {
  const provider = contractInstance.provider;
  const address = contractInstance.address;
  const topic = contractInstance.interface.getEventTopic('TransferExecuted');

  let rawLogs = [];
  try {
    rawLogs = await provider.getLogs({
      address,
      fromBlock: 0,
      toBlock: 'latest',
      topics: [topic],
    });
  } catch {
    rawLogs = await provider.getLogs({
      address,
      fromBlock: 0,
      toBlock: 'latest',
    });
  }

  const entries = [];
  for (const log of rawLogs) {
    const entry = parseTransferExecutedFromLog(contractInstance, log);
    if (entry) entries.push(entry);
  }

  if (entries.length === 0) {
    try {
      const events = await contractInstance.queryFilter(
        contractInstance.filters.TransferExecuted(),
        0,
        'latest'
      );
      for (const ev of events) {
        const entry = buildTransferLogEntry(ev.args, {
          txHash: ev.transactionHash,
          blockNumber: ev.blockNumber,
        });
        if (entry) entries.push(entry);
      }
    } catch {
      // queryFilter indisponível em alguns providers
    }
  }

  return entries;
}

function setLogsStatus(text) {
  const el = document.getElementById('logs-status');
  if (el) el.innerText = text ?? '';
}

function updateLogsStatus() {
  const n = transferLogs.filter(isValidTransferLogEntry).length;
  const orderHint = ' (últimos eventos listados primeiro)';
  if (n === 0) {
    setLogsStatus('');
    return;
  }
  if (n === 1) {
    setLogsStatus(`1 evento registrado${orderHint}`);
    return;
  }
  setLogsStatus(`${n} eventos registrados${orderHint}`);
}

function markLogHighlighted(txHash) {
  if (!txHash) return;
  highlightedLogTxHashes.add(txHash);
  setTimeout(() => {
    highlightedLogTxHashes.delete(txHash);
    renderLogsList();
  }, LOG_HIGHLIGHT_MS);
}

function notifyLogsUpdated(highlightTxHash) {
  if (highlightTxHash) markLogHighlighted(highlightTxHash);
  updateLogsStatus();
  renderLogsList();
}

function initAppFooter() {
  const link = document.getElementById('footer-contract-link');
  if (!link) return;

  if (typeof ethers === 'undefined' || !ethers.utils.isAddress(CONTRACT_ADDRESS)) {
    link.textContent = 'Contrato não configurado';
    link.removeAttribute('href');
    return;
  }

  link.textContent = CONTRACT_ADDRESS;
  const url = buildAddressExplorerUrl(CONTRACT_ADDRESS);
  if (url) {
    link.href = url;
    link.classList.remove('app-footer__link--plain');
  } else {
    link.removeAttribute('href');
    link.classList.add('app-footer__link--plain');
  }
}

function isAdminSession() {
  return Boolean(contract && isConnectedOwner());
}

function setTabHidden(tabId, hidden) {
  const tab = document.getElementById(`tab-${tabId}`);
  if (tab) tab.hidden = hidden;
}

function setAdminPanelContentVisible(visible) {
  const content = document.getElementById('admin-panel-content');
  if (content) content.hidden = !visible;
}

function switchAdminSubTab(subTabId) {
  if (!Object.values(ADMIN_SUB_TAB).includes(subTabId)) return;

  activeAdminSubTab = subTabId;
  const shell = document.querySelector('.admin-contract-tabs-shell');
  if (shell) shell.dataset.adminActive = subTabId;

  for (const id of Object.values(ADMIN_SUB_TAB)) {
    const tab = document.getElementById(`admin-tab-${id}`);
    const panel = document.getElementById(`admin-panel-${id}`);
    const selected = id === subTabId;
    if (tab) {
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
    }
    if (panel) panel.hidden = !selected;
  }
}

function syncAdminTokenPanelAvailability() {
  const unavailable = document.getElementById('admin-token-unavailable');
  const body = document.getElementById('admin-token-panel-body');
  const tabToken = document.getElementById('admin-tab-token');
  const hasToken =
    ethers.utils.isAddress(TOKEN_ADDRESS) &&
    Boolean(tokenContract || readOnlyTokenContract);

  if (unavailable) unavailable.hidden = hasToken;
  if (body) body.hidden = !hasToken;
  if (tabToken) {
    tabToken.disabled = !hasToken;
    tabToken.classList.toggle('admin-contract-tab--disabled', !hasToken);
  }
  if (!hasToken && activeAdminSubTab === ADMIN_SUB_TAB.token) {
    switchAdminSubTab(ADMIN_SUB_TAB.ether);
  }
}

function initAdminContractTabs() {
  document.getElementById('admin-tab-ether')?.addEventListener('click', () => {
    switchAdminSubTab(ADMIN_SUB_TAB.ether);
  });
  document.getElementById('admin-tab-token')?.addEventListener('click', () => {
    if (!tokenContract && !readOnlyTokenContract) return;
    switchAdminSubTab(ADMIN_SUB_TAB.token);
    if (isAdminSession()) refreshAdminTokenPanel();
  });
}

async function readMaxRecordsPerWallet(c) {
  if (!c?.maxRecordsPerWallet) return null;
  try {
    return await c.maxRecordsPerWallet();
  } catch {
    return null;
  }
}

function syncAdminMaxRecordsControls(maxRecords) {
  const available = maxRecords != null;
  const maxInput = document.getElementById('admin-max-records');
  const setBtn = document.getElementById('btn-admin-set-max-records');
  const accordion = document.getElementById('admin-acc-max-records');
  if (maxInput) {
    maxInput.disabled = !available;
    if (available && !maxInput.matches(':focus')) {
      maxInput.value = maxRecords.toString();
    }
  }
  if (setBtn) setBtn.disabled = !available;
  if (accordion) accordion.hidden = !available;
}

function switchTab(tabId) {
  if (tabId === TAB_IDS.mine && !connectedWalletAddress) return;
  if (tabId === TAB_IDS.admin && !isAdminSession()) return;

  activeTabId = tabId;

  for (const id of ALL_TAB_IDS) {
    const tab = document.getElementById(`tab-${id}`);
    const panel = document.getElementById(`panel-${id}`);
    const selected = id === tabId;
    if (tab) {
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
    }
    if (panel) panel.hidden = !selected;
  }

  document.querySelector('.tabs-shell')?.setAttribute('data-active', tabId);

  if (tabId === TAB_IDS.logs) refreshLogs();
  if (tabId === TAB_IDS.mine) refreshMyTransfers();
  if (tabId === TAB_IDS.admin) refreshAdminPanel();
}

function isConnectedOwner() {
  if (!connectedWalletAddress || !contractOwnerAddress) return false;
  return connectedWalletAddress.toLowerCase() === contractOwnerAddress.toLowerCase();
}

function setTabEnabled(tabId, enabled) {
  const tab = document.getElementById(`tab-${tabId}`);
  if (!tab) return;
  tab.disabled = !enabled;
  tab.classList.toggle('tab--disabled', !enabled);
  tab.setAttribute('aria-disabled', enabled ? 'false' : 'true');
}

function updateWalletDependentTabs() {
  const connected = !!connectedWalletAddress;
  const adminAccess = isAdminSession();

  setTabEnabled(TAB_IDS.mine, connected);
  setTabHidden(TAB_IDS.admin, !adminAccess);
  setTabEnabled(TAB_IDS.admin, adminAccess);
  setAdminPanelContentVisible(adminAccess);

  if (!connected && (activeTabId === TAB_IDS.mine || activeTabId === TAB_IDS.admin)) {
    switchTab(TAB_IDS.transfer);
  } else if (activeTabId === TAB_IDS.admin && !adminAccess) {
    switchTab(TAB_IDS.transfer);
  }
}

async function refreshContractOwner() {
  const c = contract ?? readOnlyContract;
  if (!c) {
    contractOwnerAddress = null;
    updateWalletDependentTabs();
    return;
  }

  try {
    contractOwnerAddress = await c.owner();
  } catch {
    contractOwnerAddress = null;
  }
  updateWalletDependentTabs();
}

function setMineStatus(text) {
  const el = document.getElementById('mine-status');
  if (el) el.textContent = text ?? '';
}

function setAdminOutput(text) {
  const el = document.getElementById('admin-output');
  if (el) el.textContent = text ?? '';
}

function renderStoredTransferEntry(record, index, total) {
  const valueEth = ethers.utils.formatEther(record.value);
  const feeEth = ethers.utils.formatEther(record.fee);
  const from = String(record.from);
  const to = String(record.to);
  const fromUrl = buildAddressExplorerUrl(from);
  const toUrl = buildAddressExplorerUrl(to);
  const position = total - index;
  return (
    `<strong>Registro #${position}</strong>` +
    `<span class="log-line">De: ${explorerLink(fromUrl, from)}</span>` +
    `<span class="log-line">Para: ${explorerLink(toUrl, to)}</span>` +
    `<span class="log-line">Líquido: ${valueEth} ETH · Taxa: ${feeEth} ETH</span>`
  );
}

function renderMyTransfersList(records) {
  const list = document.getElementById('mine-list');
  const empty = document.getElementById('mine-empty');
  if (!list || !empty) return;

  list.innerHTML = '';
  let items = Array.isArray(records) ? [...records].reverse() : [];
  const filter = normalizeFilterAddress(mineFilterAddress);
  if (filter) {
    items = items.filter((record) => String(record.to).toLowerCase() === filter.toLowerCase());
  }

  const { page, totalPages, total, slice } = paginateItems(items, minePage);
  minePage = page;
  updatePaginationUi({
    pageInfoId: 'mine-page-info',
    prevId: 'btn-mine-prev',
    nextId: 'btn-mine-next',
    page,
    totalPages,
    total,
  });

  empty.hidden = total > 0;
  if (filter && total === 0) {
    empty.textContent = 'Nenhum registro para o destino filtrado.';
  } else {
    empty.textContent = 'Nenhuma transferência registrada para esta carteira.';
  }

  slice.forEach((record, displayIndex) => {
    const li = document.createElement('li');
    li.className = 'log-entry';
    const globalIndex = page * LIST_PAGE_SIZE + displayIndex;
    li.innerHTML = renderStoredTransferEntry(record, globalIndex, items.length);
    list.appendChild(li);
  });
}

async function refreshMyTransfers() {
  if (!contract || !connectedWalletAddress) {
    myTransfersCache = [];
    renderMyTransfersList([]);
    setMineStatus('Conecte a carteira para ver seu histórico on-chain.');
    return;
  }

  setMineStatus('Carregando…');
  try {
    const records = await contract.getTransfersByOrigin(connectedWalletAddress);
    myTransfersCache = records;
    const count = records.length;
    renderMyTransfersList(records);
    setMineStatus(
      count === 0
        ? 'Nenhum registro em transfersByOrigin para esta carteira.'
        : `${count} registro(s) on-chain para ${connectedWalletAddress}.`
    );
  } catch (err) {
    myTransfersCache = [];
    renderMyTransfersList([]);
    setMineStatus(friendlyContractError(err));
  }
}

function setAdminSelectedWallet(address) {
  adminSelectedWallet = address;
  const hasWallet = !!address && ethers.utils.isAddress(address);
  const select = document.getElementById('admin-wallet-select');
  const summary = document.getElementById('admin-selected-summary');
  const clearBtn = document.getElementById('btn-admin-clear');
  const pruneBtn = document.getElementById('btn-admin-prune');

  if (select) {
    const nextValue = hasWallet ? address : '';
    if (select.value !== nextValue) {
      select.value = nextValue;
    }
  }
  if (summary) {
    const walletCount = adminWalletEntries.length;
    if (hasWallet) {
      summary.textContent = shortenAddress(address);
      summary.title = address;
    } else if (walletCount > 0) {
      summary.textContent = `${walletCount} carteira(s)`;
      summary.title = 'Selecione uma carteira no menu';
    } else {
      summary.textContent = 'Nenhuma';
      summary.title = '';
    }
  }
  if (clearBtn) clearBtn.disabled = !hasWallet;
  if (pruneBtn) pruneBtn.disabled = !hasWallet;
}

function shortenAddress(addr) {
  if (!addr || addr.length < 12) return addr ?? '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function updateAdminAccordionMeta({ enabled, feesBalanceEth, owner, maxRecords } = {}) {
  const enabledSummary = document.getElementById('admin-enabled-summary');
  const feesSummary = document.getElementById('admin-fees-summary');
  const ownerSummary = document.getElementById('admin-owner-summary');
  const maxRecordsSummary = document.getElementById('admin-max-records-summary');

  if (enabledSummary != null && enabled !== undefined) {
    enabledSummary.textContent = enabled ? 'Ativo' : 'Suspenso';
  }
  if (feesSummary != null && feesBalanceEth !== undefined) {
    feesSummary.textContent = `${feesBalanceEth} ETH`;
  }
  if (ownerSummary != null && owner !== undefined) {
    ownerSummary.textContent = shortenAddress(owner);
    ownerSummary.title = owner;
  }
  if (maxRecordsSummary != null && maxRecords !== undefined) {
    maxRecordsSummary.textContent = maxRecords;
  }
}

async function refreshAdminTokenPanel() {
  const statusEl = document.getElementById('admin-token-status');
  const rateInput = document.getElementById('admin-token-rate-eth');
  if (!statusEl) return;

  const c = tokenContract;
  syncAdminTokenPanelAvailability();
  if (!c || !isAdminSession()) {
    statusEl.innerHTML = '';
    return;
  }

  try {
    const [name, symbol, totalSupply, weiPerToken, owner] = await Promise.all([
      c.name(),
      c.symbol(),
      c.totalSupply(),
      c.weiPerToken(),
      c.owner(),
    ]);
    const rateEth = ethers.utils.formatEther(weiPerToken);
    const tokenUrl = buildAddressExplorerUrl(TOKEN_ADDRESS);
    statusEl.innerHTML =
      `<div><dt>Contrato</dt><dd>${explorerLink(tokenUrl, TOKEN_ADDRESS)}</dd></div>` +
      `<div><dt>Nome</dt><dd>${escapeHtml(name)} (${escapeHtml(symbol)})</dd></div>` +
      `<div><dt>Total supply</dt><dd>${escapeHtml(ethers.utils.formatEther(totalSupply))} ${escapeHtml(symbol)}</dd></div>` +
      `<div><dt>Cotação</dt><dd>1 ${escapeHtml(symbol)} = ${escapeHtml(rateEth)} ETH</dd></div>` +
      `<div><dt>Owner</dt><dd>${explorerLink(buildAddressExplorerUrl(owner), owner)}</dd></div>` +
      `<div><dt>Carteira</dt><dd>${connectedWalletAddress}</dd></div>`;
    if (rateInput && !rateInput.matches(':focus')) {
      rateInput.value = rateEth;
    }
  } catch (err) {
    statusEl.textContent = friendlyContractError(err);
  }
}

function syncAdminEnabledToggle(enabled, { disabled = false } = {}) {
  const toggle = document.getElementById('admin-enabled-toggle');
  const label = document.getElementById('admin-enabled-label');
  if (!toggle) return;

  adminToggleSyncing = true;
  toggle.disabled = disabled;
  toggle.checked = !!enabled;
  toggle.setAttribute('aria-checked', enabled ? 'true' : 'false');
  if (label) {
    label.textContent = enabled ? 'Ativo' : 'Suspenso';
  }
  updateAdminAccordionMeta({ enabled });
  adminToggleSyncing = false;
}

function renderAdminWalletSelect(addresses) {
  adminWalletEntries = addresses.map((a) => String(a));
  const select = document.getElementById('admin-wallet-select');
  const empty = document.getElementById('admin-wallets-empty');
  if (!select || !empty) return;

  const previous = adminSelectedWallet;
  select.innerHTML = '<option value="">— Selecione uma carteira —</option>';

  for (const address of adminWalletEntries) {
    const option = document.createElement('option');
    option.value = address;
    option.textContent = address;
    select.appendChild(option);
  }

  select.disabled = adminWalletEntries.length === 0;
  empty.hidden = adminWalletEntries.length > 0;

  let selected = previous;
  const stillRegistered =
    selected &&
    adminWalletEntries.some((a) => a.toLowerCase() === selected.toLowerCase());
  if (!stillRegistered) selected = null;
  if (!selected && adminWalletEntries.length === 1) {
    selected = adminWalletEntries[0];
  }

  setAdminSelectedWallet(selected);
}

async function refreshAdminWalletsList() {
  const statusEl = document.getElementById('admin-wallets-status');
  if (!isAdminSession()) {
    renderAdminWalletSelect([]);
    if (statusEl) statusEl.textContent = '';
    setAdminSelectedWallet(null);
    return;
  }

  if (statusEl) statusEl.textContent = 'Carregando carteiras…';
  try {
    const wallets = await contract.getRegisteredWallets();
    const addresses = wallets.map((wallet) => String(wallet));
    renderAdminWalletSelect(addresses);
    if (statusEl) statusEl.textContent = '';
  } catch (err) {
    renderAdminWalletSelect([]);
    setAdminSelectedWallet(null);
    if (statusEl) statusEl.textContent = friendlyContractError(err);
  }
}

async function refreshAdminPanel() {
  const statusEl = document.getElementById('admin-eth-status');
  if (!statusEl) return;

  if (!isAdminSession()) {
    statusEl.textContent = '';
    syncAdminEnabledToggle(false, { disabled: true });
    setAdminPanelContentVisible(false);
    syncAdminTokenPanelAvailability();
    return;
  }

  setAdminPanelContentVisible(true);
  syncAdminTokenPanelAvailability();
  statusEl.textContent = 'Carregando…';
  try {
    const [owner, enabled, regCount, balanceWei] = await Promise.all([
      contract.owner(),
      contract.enabled(),
      contract.getRegisteredWalletCount(),
      contract.getContractBalance(),
    ]);
    const maxRecords = await readMaxRecordsPerWallet(contract);
    const maxRecordsLabel =
      maxRecords != null ? maxRecords.toString() : '— (redeploy necessário)';
    const ownerUrl = buildAddressExplorerUrl(owner);
    const contractUrl = buildAddressExplorerUrl(CONTRACT_ADDRESS);
    const balanceEth = ethers.utils.formatEther(balanceWei);
    statusEl.innerHTML =
      `<dl>` +
      `<div><dt>Contrato</dt><dd>${explorerLink(contractUrl, CONTRACT_ADDRESS)}</dd></div>` +
      `<div><dt>Owner</dt><dd>${explorerLink(ownerUrl, owner)}</dd></div>` +
      `<div><dt>Carteira</dt><dd>${connectedWalletAddress}</dd></div>` +
      `<div><dt>Operações</dt><dd>${enabled ? 'Ativas (enabled)' : 'Suspensas (!enabled)'}</dd></div>` +
      `<div><dt>Carteiras c/ histórico</dt><dd>${regCount.toString()}</dd></div>` +
      `<div><dt>Saldo contrato (taxas)</dt><dd>${balanceEth} ETH</dd></div>` +
      `<div><dt>maxRecordsPerWallet</dt><dd>${maxRecordsLabel}</dd></div>` +
      `</dl>`;
    applyOperationsEnabledState(enabled);
    syncAdminEnabledToggle(enabled, { disabled: false });
    updateAdminAccordionMeta({
      enabled,
      feesBalanceEth: balanceEth,
      owner,
      maxRecords: maxRecordsLabel,
    });
    syncAdminMaxRecordsControls(maxRecords);
    await refreshAdminWalletsList();
    await refreshAdminTokenPanel();
  } catch (err) {
    statusEl.textContent = friendlyContractError(err);
    syncAdminEnabledToggle(false, { disabled: true });
  }
}

async function runAdminTx(label, sendTx, { onSuccess } = {}) {
  if (!isAdminSession()) {
    showToast('Conecte a carteira do owner do contrato.', { type: 'error' });
    return false;
  }

  setAdminOutput(`${label}…`);
  try {
    const tx = await sendTx();
    setAdminOutput(`Tx enviada: ${tx.hash}`);
    await tx.wait();
    setAdminOutput(`Concluído: ${tx.hash}`);
    showToast(`${label} concluído.`, { type: 'success' });
    await refreshAdminPanel();
    if (activeTabId === TAB_IDS.mine) await refreshMyTransfers();
    await refreshLogs();
    if (onSuccess) await onSuccess();
    return true;
  } catch (err) {
    setAdminOutput(friendlyContractError(err));
    showToast(friendlyContractError(err), { type: 'error' });
    return false;
  }
}

async function onAdminEnabledToggleChange(event) {
  if (adminToggleSyncing || !isAdminSession()) return;

  const toggle = event.target;
  const enabled = toggle.checked;
  const previous = !enabled;

  const ok = await runAdminTx(
    enabled ? 'Ativando transferEther' : 'Suspendendo transferEther',
    () => contract.setEnabled(enabled)
  );
  if (!ok) {
    syncAdminEnabledToggle(previous, { disabled: false });
  }
}

async function adminClearWallet() {
  const wallet = adminSelectedWallet;
  if (!wallet || !ethers.utils.isAddress(wallet)) {
    showToast('Selecione uma carteira na lista.', { type: 'error' });
    return;
  }
  if (!confirm(`Limpar todo o histórico on-chain de ${wallet}?`)) return;
  await runAdminTx(`Limpando histórico de ${wallet}`, () => contract.clearTransfersByOrigin(wallet));
}

async function adminPruneWallet() {
  const wallet = adminSelectedWallet;
  const keepRaw = document.getElementById('admin-prune-keep')?.value.trim() ?? '';
  const keepLast = Number.parseInt(keepRaw, 10);
  if (!wallet || !ethers.utils.isAddress(wallet)) {
    showToast('Selecione uma carteira na lista.', { type: 'error' });
    return;
  }
  if (!Number.isFinite(keepLast) || keepLast <= 0) {
    showToast('Informe N > 0 para manter os últimos registros.', { type: 'error' });
    return;
  }
  await runAdminTx(`Mantendo últimos ${keepLast} de ${wallet}`, () =>
    contract.pruneTransfersByOrigin(wallet, keepLast)
  );
}

async function adminClearAll() {
  if (
    !confirm(
      'Isso apaga TODO o histórico on-chain de TODAS as carteiras registradas. Continuar?'
    )
  ) {
    return;
  }
  await runAdminTx('Limpando todo o histórico on-chain', () => contract.clearAllTransfers());
}

async function adminWithdrawFees() {
  const toRaw =
    document.getElementById('admin-withdraw-to')?.value.trim() || connectedWalletAddress;
  const amountRaw = document.getElementById('admin-withdraw-amount')?.value.trim() ?? '';

  if (!ethers.utils.isAddress(toRaw)) {
    showToast('Informe um endereço destino válido para o saque.', { type: 'error' });
    return;
  }

  if (!amountRaw) {
    await runAdminTx('Sacando todas as taxas', () => contract.withdrawAllFees(toRaw));
    return;
  }

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    showToast('Informe um valor em ETH maior que zero ou deixe vazio para sacar tudo.', {
      type: 'error',
    });
    return;
  }

  await runAdminTx('Sacando taxas', () =>
    contract.withdrawFees(toRaw, ethers.utils.parseEther(amountRaw))
  );
}

async function adminTransferOwnership() {
  const newOwner = document.getElementById('admin-new-owner')?.value.trim() ?? '';
  if (!ethers.utils.isAddress(newOwner)) {
    showToast('Informe o endereço do novo owner.', { type: 'error' });
    return;
  }
  if (
    !confirm(
      `Transferir ownership para ${newOwner}? Você perderá acesso admin com a carteira atual.`
    )
  ) {
    return;
  }
  await runAdminTx('Transferindo ownership', () => contract.transferOwnership(newOwner));
}

async function adminRenounceOwnership() {
  if (
    !confirm(
      'Renunciar ownership deixa o contrato sem owner administrativo. Continuar?'
    )
  ) {
    return;
  }
  await runAdminTx('Renunciando ownership', () => contract.renounceOwnership());
}

async function adminSetMaxRecords() {
  const raw = document.getElementById('admin-max-records')?.value.trim() ?? '';
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value <= 0) {
    showToast('Informe um limite inteiro maior que zero.', { type: 'error' });
    return;
  }
  await runAdminTx('Atualizando maxRecordsPerWallet', () =>
    contract.setMaxRecordsPerWallet(value)
  );
}

async function adminTokenMint() {
  if (!tokenContract) {
    showToast('Token indisponível. Rode npm run deploy:local.', { type: 'error' });
    return;
  }
  const to = document.getElementById('admin-token-mint-to')?.value.trim() ?? '';
  const amountRaw = document.getElementById('admin-token-mint-amount')?.value.trim() ?? '';
  if (!ethers.utils.isAddress(to)) {
    showToast('Informe um endereço destino válido.', { type: 'error' });
    return;
  }
  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    showToast('Informe uma quantidade de tokens maior que zero.', { type: 'error' });
    return;
  }
  await runAdminTx(`Mint de ${amountRaw} ${tokenSymbol} para ${to}`, () =>
    tokenContract.mint(to, ethers.utils.parseEther(amountRaw)),
    { onSuccess: refreshHeaderBalances }
  );
}

async function adminTokenBurn() {
  if (!tokenContract) {
    showToast('Token indisponível. Rode npm run deploy:local.', { type: 'error' });
    return;
  }
  const from = document.getElementById('admin-token-burn-from')?.value.trim() ?? '';
  const amountRaw = document.getElementById('admin-token-burn-amount')?.value.trim() ?? '';
  if (!ethers.utils.isAddress(from)) {
    showToast('Informe um endereço válido.', { type: 'error' });
    return;
  }
  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    showToast('Informe uma quantidade maior que zero.', { type: 'error' });
    return;
  }
  if (!confirm(`Queimar ${amountRaw} ${tokenSymbol} da carteira ${from}?`)) return;
  await runAdminTx(`Burn de ${amountRaw} ${tokenSymbol}`, () =>
    tokenContract.burnFrom(from, ethers.utils.parseEther(amountRaw)),
    { onSuccess: refreshHeaderBalances }
  );
}

async function adminTokenSetRate() {
  if (!tokenContract) {
    showToast('Token indisponível. Rode npm run deploy:local.', { type: 'error' });
    return;
  }
  const rateRaw = document.getElementById('admin-token-rate-eth')?.value.trim() ?? '';
  const rate = Number(rateRaw);
  if (!Number.isFinite(rate) || rate <= 0) {
    showToast('Informe o valor de 1 token em ETH (maior que zero).', { type: 'error' });
    return;
  }
  await runAdminTx('Atualizando cotação do token', () =>
    tokenContract.setEthRate(ethers.utils.parseEther(rateRaw)),
    {
      onSuccess: async () => {
        await refreshTokenMetadata();
        await refreshAdminTokenPanel();
      },
    }
  );
}

function initTabs() {
  document
    .getElementById('tab-transfer')
    ?.addEventListener('click', () => switchTab(TAB_IDS.transfer));
  document.getElementById('tab-logs')?.addEventListener('click', () => switchTab(TAB_IDS.logs));
  document.getElementById('tab-mine')?.addEventListener('click', () => switchTab(TAB_IDS.mine));
  document.getElementById('tab-admin')?.addEventListener('click', () => {
    if (!isAdminSession()) return;
    switchTab(TAB_IDS.admin);
  });
  initAdminContractTabs();
}

function renderLogsList() {
  const list = document.getElementById('logs-list');
  const empty = document.getElementById('logs-empty');
  if (!list || !empty) return;

  list.innerHTML = '';
  let validLogs = transferLogs.filter(isValidTransferLogEntry);
  const filter = normalizeFilterAddress(logsFilterAddress);
  if (filter) {
    validLogs = validLogs.filter((log) => String(log.to).toLowerCase() === filter.toLowerCase());
  }

  const { page, totalPages, total, slice } = paginateItems(validLogs, logsPage);
  logsPage = page;
  updatePaginationUi({
    pageInfoId: 'logs-page-info',
    prevId: 'btn-logs-prev',
    nextId: 'btn-logs-next',
    page,
    totalPages,
    total,
  });

  empty.hidden = total > 0;
  if (filter && total === 0) {
    empty.textContent = 'Nenhum evento para o destino filtrado.';
  } else if (total === 0) {
    empty.textContent = 'Nenhum evento encontrado ainda.';
  }

  for (const log of slice) {
    const li = document.createElement('li');
    li.className = 'log-entry';
    if (highlightedLogTxHashes.has(log.txHash)) {
      li.classList.add('log-entry--new');
    }
    const valueEth = ethers.utils.formatEther(log.value);
    const feeEth = ethers.utils.formatEther(log.fee);
    const from = String(log.from);
    const to = String(log.to);
    const txUrl = buildTxExplorerUrl(log.txHash);
    const fromUrl = buildAddressExplorerUrl(from);
    const toUrl = buildAddressExplorerUrl(to);
    li.innerHTML =
      `<strong>TransferExecuted</strong> · bloco #${logBlockNumber(log.blockNumber)}` +
      `<span class="log-meta log-line">Tx: ${explorerLink(txUrl, log.txHash)}</span>` +
      `<span class="log-line">De: ${explorerLink(fromUrl, from)}</span>` +
      `<span class="log-line">Para: ${explorerLink(toUrl, to)}</span>` +
      `<span class="log-line">Líquido: ${valueEth} ETH · Taxa: ${feeEth} ETH</span>`;
    list.appendChild(li);
  }
}

function logBlockNumber(n) {
  if (n == null) return 0;
  if (ethers.BigNumber.isBigNumber(n)) return n.toNumber();
  return Number(n);
}

function upsertTransferLog(entry) {
  const idx = transferLogs.findIndex((l) => l.txHash === entry.txHash);
  const isNew = idx < 0;
  if (idx >= 0) transferLogs[idx] = entry;
  else transferLogs.push(entry);
  transferLogs.sort((a, b) => logBlockNumber(b.blockNumber) - logBlockNumber(a.blockNumber));
  return isNew;
}

function onTransferExecutedEvent(...args) {
  const event = args[args.length - 1];
  if (!event?.transactionHash) return;
  const entry = buildTransferLogEntry([args[0], args[1], args[2], args[3]], {
    txHash: event.transactionHash,
    blockNumber: event.blockNumber,
  });
  if (!entry) return;
  const isNew = upsertTransferLog(entry);
  notifyLogsUpdated(isNew ? entry.txHash : null);
}

function teardownTransferLogsListener() {
  if (logsListenerContract) {
    logsListenerContract.removeAllListeners('TransferExecuted');
    logsListenerContract = null;
  }
}

function teardownContractEventListeners() {
  if (contractEventsListener) {
    contractEventsListener.removeAllListeners('OperationsStatusChanged');
    contractEventsListener = null;
  }
}

function setupContractEventListeners() {
  teardownContractEventListeners();
  const c = contract ?? readOnlyContract;
  if (!c) return;

  contractEventsListener = c;
  c.on('OperationsStatusChanged', (enabled) => {
    applyOperationsEnabledState(enabled);
    if (activeTabId === TAB_IDS.admin && isAdminSession()) {
      refreshAdminPanel();
    }
  });
}

function setupTransferLogsListener() {
  teardownTransferLogsListener();
  setupContractEventListeners();
  const c = contract ?? readOnlyContract;
  if (!c) return;

  logsListenerContract = c;
  c.on('TransferExecuted', onTransferExecutedEvent);
}

async function refreshLogs() {
  const c = getLogsContract();
  if (!c) {
    setLogsStatus('Provider ou contrato indisponível. Conecte a carteira ou inicie o nó Hardhat.');
    transferLogs = [];
    renderLogsList();
    return;
  }

  if (typeof ethers === 'undefined') {
    setLogsStatus('ethers.js não carregou.');
    return;
  }

  setLogsStatus('Carregando eventos...');
  try {
    const bytecode = await c.provider.getCode(CONTRACT_ADDRESS);
    if (!bytecode || bytecode === '0x') {
      setLogsStatus(
        `Nenhum contrato em ${CONTRACT_ADDRESS}. Rode npm run deploy:local e npm run generate-config.`
      );
      transferLogs = [];
      renderLogsList();
      return;
    }

    const fetched = await fetchTransferExecutedLogs(c);
    if (fetched.length > 0) {
      transferLogs = fetched.sort(
        (a, b) => logBlockNumber(b.blockNumber) - logBlockNumber(a.blockNumber)
      );
    } else {
      let hint = 'Nenhum evento on-chain ainda. Após reiniciar o nó, rode npm run deploy:local.';
      try {
        const anyLogs = await c.provider.getLogs({
          address: CONTRACT_ADDRESS,
          fromBlock: 0,
          toBlock: 'latest',
        });
        if (anyLogs.length > 0) {
          hint = 'Há logs no contrato, mas não batem com o ABI atual — rode npm run deploy:local.';
        }
      } catch {
        // ignora falha de diagnóstico
      }
      if (transferLogs.length === 0) {
        setLogsStatus(hint);
      }
    }
    updateLogsStatus();
    renderLogsList();
  } catch (err) {
    setLogsStatus(friendlyContractError(err));
    renderLogsList();
  }
}

const HARDHAT_LOCAL_CHAIN = {
  chainId: chainIdToHex(HARDHAT_LOCAL_CHAIN_ID),
  chainName: 'Hardhat Local',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8545'],
};

async function addHardhatNetworkViaSite() {
  const ethereum = getInjectableProvider();
  if (!ethereum || typeof ethereum.request !== 'function') {
    showToast('Instale a MetaMask e abra esta página no navegador com a extensão.', {
      type: 'error',
    });
    return;
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: HARDHAT_LOCAL_CHAIN.chainId }],
    });
    setNetworkStatusUi(`Rede Hardhat local (${HARDHAT_LOCAL_CHAIN_ID}) selecionada.`);
    showToast('Rede Hardhat local selecionada.', { type: 'success' });
  } catch (err) {
    if (err?.code === 4902 || err?.code === '4902') {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [HARDHAT_LOCAL_CHAIN],
      });
      setNetworkStatusUi('Rede Hardhat local adicionada com sucesso.');
      showToast('Rede Hardhat local adicionada.', { type: 'success' });
      return;
    }
    setNetworkStatusUi(friendlyWalletError(err));
    showToast(friendlyWalletError(err), { type: 'error' });
  }
}

function handleWalletButtonClick() {
  if (isWalletConnected()) {
    disconnectWallet();
  } else {
    connectWallet();
  }
}

let walletListenersBound = false;
let isHandlingAccountSwitch = false;

function initWalletProviderListeners() {
  const bind = () => {
    const ethereum = getInjectableProvider();
    if (!ethereum?.on || walletListenersBound) return Boolean(ethereum);
    walletListenersBound = true;
    ethereum.on('accountsChanged', (accounts) => {
      handleAccountsChanged(accounts).catch((err) => {
        console.error('accountsChanged', err);
      });
    });
    ethereum.on('chainChanged', (chainIdHex) => {
      handleChainChanged(chainIdHex).catch((err) => {
        console.error('chainChanged', err);
      });
    });
    return true;
  };

  if (bind()) return;

  window.addEventListener(
    'ethereum#initialized',
    () => {
      bind();
      tryRestoreWalletSession();
    },
    { once: true }
  );
}

async function tryRestoreWalletSession() {
  if (isWalletConnected()) return;

  const ethereum = getInjectableProvider();
  if (!ethereum?.request) return;

  isHandlingAccountSwitch = true;
  try {
    await connectWallet({ silent: true });
  } finally {
    isHandlingAccountSwitch = false;
  }
}

async function handleChainChanged(chainIdHex) {
  const chainId = normalizeChainId(chainIdHex);
  currentChainId = chainId;
  updateNetworkBadge(chainId);
  showToast(`Rede alterada (${getNetworkLabel(chainId).label}). Sincronizando…`, { type: 'info' });

  await disconnectWallet({ skipRevoke: true, skipTabSwitch: true });
  await tryRestoreWalletSession();
  await runHealthCheck();
}

async function handleAccountsChanged(accounts) {
  if (isHandlingAccountSwitch) return;

  const previousAddress = connectedWalletAddress;
  if (!previousAddress || !isWalletConnected()) return;

  const nextAddress = accounts?.[0] ?? null;
  if (
    nextAddress &&
    nextAddress.toLowerCase() === previousAddress.toLowerCase()
  ) {
    return;
  }

  isHandlingAccountSwitch = true;
  try {
    const pendingAddress = nextAddress;
    await disconnectWallet({ skipRevoke: true });

    if (!pendingAddress) return;

    const short = `${pendingAddress.slice(0, 6)}…${pendingAddress.slice(-4)}`;
    const wantsConnect = window.confirm(
      `Você trocou a conta ativa na MetaMask (${short}).\n\nDeseja conectar com esta nova conta?`
    );
    if (wantsConnect) {
      await connectWallet();
    }
  } finally {
    isHandlingAccountSwitch = false;
  }
}

async function disconnectWallet(options = {}) {
  const { skipRevoke = false, skipTabSwitch = false } = options;
  const ethereum = getInjectableProvider();
  if (!skipRevoke && ethereum?.request) {
    try {
      await ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      });
    } catch {
      // Permissão já revogada ou carteira sem suporte — limpa o estado local mesmo assim
    }
  }

  teardownTransferLogsListener();
  teardownContractEventListeners();
  provider = null;
  signer = null;
  contract = null;
  proxyContract = null;
  tokenContract = null;

  clearTransferForm();
  setTransferActionsEnabled(false);
  setWalletUi('');
  setBalanceChipPlaceholder('wallet-balance-value', '—');
  renderMyTransfersList([]);
  setMineStatus('');
  adminSelectedWallet = null;
  adminWalletEntries = [];
  renderAdminWalletSelect([]);
  setAdminSelectedWallet(null);
  syncAdminEnabledToggle(false, { disabled: true });
  updateAdminAccordionMeta({ enabled: false });
  setAdminOutput('');
  const adminEthStatus = document.getElementById('admin-eth-status');
  if (adminEthStatus) adminEthStatus.textContent = '';
  syncAdminTokenPanelAvailability();
  updateConnectButton();

  await showContractBalance();
  await refreshLogs();
  setupTransferLogsListener();
  await refreshContractOwner();
  if (!skipTabSwitch) {
    switchTab(TAB_IDS.transfer);
  }
  applyOperationsEnabledState(true);
}

function getChainLabel(chainId) {
  const id = normalizeChainId(chainId);
  if (id === HARDHAT_LOCAL_CHAIN_ID) return '(Hardhat local)';
  if (id === SEPOLIA_CHAIN_ID) return '(Sepolia)';
  return `(chain ${id})`;
}

async function bindProxyContract() {
  proxyContract = null;
  if (!signer || !provider || !ethers.utils.isAddress(PROXY_ADDRESS)) return;

  try {
    const bytecode = await provider.getCode(PROXY_ADDRESS);
    if (!bytecode || bytecode === '0x') return;
    proxyContract = new ethers.Contract(PROXY_ADDRESS, PROXY_ABI, signer);
  } catch {
    proxyContract = null;
  }
}

async function connectWallet(options = {}) {
  const { silent = false } = options;

  if (typeof ethers === 'undefined') {
    const msg = 'ethers.js não carregou (verifique vendor/ethers.umd.min.js).';
    if (!silent) {
      setWalletUi(msg);
      showToast(msg, { type: 'error' });
    }
    return false;
  }

  const ethereum = getInjectableProvider();
  if (!ethereum || typeof ethereum.request !== 'function') {
    if (!silent) {
      showToast('Instale a MetaMask e abra esta página no navegador com a extensão.', {
        type: 'error',
      });
    }
    return false;
  }

  try {
    if (silent) {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (!accounts?.length) return false;
    } else {
      await ethereum.request({ method: 'eth_requestAccounts' });
    }
    provider = new ethers.providers.Web3Provider(ethereum);
    signer = provider.getSigner();

    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const chainId = normalizeChainId(network.chainId);
    currentChainId = chainId;
    updateNetworkBadge(chainId);

    setWalletUiConnected(address, chainId, getChainLabel(chainId));
    updateConnectButton();

    if (!ethers.utils.isAddress(CONTRACT_ADDRESS)) {
      setTransferActionsEnabled(false);
      setTransferOutput('Defina CONTRACT_ADDRESS com o endereço do contrato deployado.');
      await refreshContractOwner();
      await runHealthCheck();
      return true;
    }

    const bytecode = await provider.getCode(CONTRACT_ADDRESS);
    if (!bytecode || bytecode === '0x') {
      setTransferActionsEnabled(false);
      setTransferOutput(`Não há contrato em ${CONTRACT_ADDRESS} na rede atual.`);
      await refreshContractOwner();
      await runHealthCheck();
      return true;
    }

    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    await bindProxyContract();
    await bindTokenContract();
    clearTransferForm();
    setupTransferLogsListener();

    try {
      const enabled = await contract.enabled();
      applyOperationsEnabledState(enabled);
    } catch {
      applyOperationsEnabledState(true);
    }

    syncTransferFormAvailability();
    await refreshContractOwner();
    await refreshHeaderBalances();
    await refreshLogs();
    await runHealthCheck();
    if (activeTabId === TAB_IDS.mine) await refreshMyTransfers();
    if (activeTabId === TAB_IDS.admin && isAdminSession()) await refreshAdminPanel();
    if (!silent) {
      showToast('Carteira conectada.', { type: 'success' });
    }
    return true;
  } catch (err) {
    provider = null;
    signer = null;
    contract = null;
    proxyContract = null;
    tokenContract = null;
    if (!silent) {
      setWalletUi(friendlyWalletError(err));
      updateConnectButton();
      showToast(friendlyWalletError(err), { type: 'error' });
    }
    return false;
  }
}

async function transferSubmit(event) {
  if (isTokenTransferMode()) {
    await transferToken(event);
  } else {
    await transferEther(event);
  }
}

async function transferToken(event) {
  event.preventDefault();
  if (!tokenContract) {
    showToast('Token indisponível na rede atual. Rode npm run deploy:local.', { type: 'error' });
    return;
  }

  const to = document.getElementById('input-to-address').value.trim();
  const amountRaw = document.getElementById('input-amount-eth').value.trim();

  if (!ethers.utils.isAddress(to)) {
    showToast('Informe um endereço destino válido.', { type: 'error' });
    return;
  }

  if (!amountRaw || Number(amountRaw) <= 0) {
    showToast(`Informe um valor maior que zero em ${tokenSymbol}.`, { type: 'error' });
    return;
  }

  const amountWei = ethers.utils.parseEther(amountRaw);

  try {
    await tokenContract.callStatic.transfer(to, amountWei);
  } catch (err) {
    showToast(friendlyContractError(err), { type: 'error' });
    return;
  }

  try {
    const tx = await tokenContract.transfer(to, amountWei);
    setTransferPending(tx.hash);
    await tx.wait();
    setTransferSuccess(tx.hash);
    showToast(`Transferência de ${amountRaw} ${tokenSymbol} confirmada.`, { type: 'success' });
    await refreshHeaderBalances();
  } catch (err) {
    setTransferOutput(friendlyContractError(err));
    showToast(friendlyContractError(err), { type: 'error' });
  }
}

async function transferEther(event) {
  event.preventDefault();
  if (!contract) {
    showToast('Conecte a carteira primeiro!', { type: 'error' });
    return;
  }

  const to = document.getElementById('input-to-address').value.trim();
  const amountEth = document.getElementById('input-amount-eth').value.trim();

  if (!ethers.utils.isAddress(to)) {
    showToast('Informe um endereço destino válido.', { type: 'error' });
    return;
  }

  if (!amountEth || Number(amountEth) <= 0) {
    showToast('Informe um valor maior que zero em ETH.', { type: 'error' });
    return;
  }

  try {
    await contract.callStatic.transferEther(to, {
      value: ethers.utils.parseEther(amountEth),
    });
  } catch (err) {
    showToast(friendlyContractError(err), { type: 'error' });
    return;
  }

  try {
    const tx = await contract.transferEther(to, {
      value: ethers.utils.parseEther(amountEth),
    });
    setTransferPending(tx.hash);
    const receipt = await tx.wait();
    await refreshLogs();
    const logged = ingestTransferExecutedFromReceipt(receipt, contract);
    notifyLogsUpdated(logged?.txHash);
    setTransferSuccess(tx.hash, { eventLog: logged });
    showToast('Transferência confirmada.', { type: 'success' });
    await refreshHeaderBalances();
    if (activeTabId === TAB_IDS.mine) await refreshMyTransfers();
  } catch (err) {
    setTransferOutput(friendlyContractError(err));
    showToast(friendlyContractError(err), { type: 'error' });
  }
}

async function transferEtherViaProxy() {
  if (!proxyContract) {
    showToast('TransferProxy não configurado. Rode npm run deploy:local.', { type: 'error' });
    return;
  }

  const to = document.getElementById('input-to-address').value.trim();
  const amountEth = document.getElementById('input-amount-eth').value.trim();

  if (!ethers.utils.isAddress(to)) {
    showToast('Informe um endereço destino válido.', { type: 'error' });
    return;
  }

  if (!amountEth || Number(amountEth) <= 0) {
    showToast('Informe um valor maior que zero em ETH.', { type: 'error' });
    return;
  }

  try {
    await proxyContract.callStatic.proxyTransfer(to, {
      value: ethers.utils.parseEther(amountEth),
    });
  } catch (err) {
    showToast(friendlyContractError(err), { type: 'error' });
    return;
  }

  try {
    const tx = await proxyContract.proxyTransfer(to, {
      value: ethers.utils.parseEther(amountEth),
    });
    setTransferPending(tx.hash);
    const receipt = await tx.wait();
    await refreshLogs();
    const logged = ingestTransferExecutedFromReceipt(receipt, contract);
    notifyLogsUpdated(logged?.txHash);
    setTransferSuccess(tx.hash, { eventLog: logged });
    showToast(
      'Transferência via proxy confirmada. O proxy foi o msg.sender, mas o histórico segue em sua carteira (tx.origin).',
      { type: 'success', duration: 7000 }
    );
    await refreshHeaderBalances();
    if (activeTabId === TAB_IDS.mine) await refreshMyTransfers();
  } catch (err) {
    setTransferOutput(friendlyContractError(err));
    showToast(friendlyContractError(err), { type: 'error' });
  }
}

function getBalanceContract() {
  return contract ?? readOnlyContract ?? null;
}

function getBalanceProvider() {
  return provider ?? readOnlyProvider ?? null;
}

async function showContractBalance() {
  const balanceContract = getBalanceContract();
  if (!balanceContract) {
    setBalanceChipPlaceholder('contract-balance-value', '—');
    return;
  }

  try {
    const balanceWei = await balanceContract.getContractBalance();
    renderContractBalanceChip(balanceWei);
  } catch (err) {
    setBalanceChipPlaceholder('contract-balance-value', '—');
  }
}

async function showWalletBalance() {
  if (!signer || !provider) {
    setBalanceChipPlaceholder('wallet-balance-value', '—');
    return;
  }

  try {
    const address = await signer.getAddress();
    const balanceWei = await provider.getBalance(address);
    renderWalletBalanceChip(balanceWei);
  } catch (err) {
    setBalanceChipPlaceholder('wallet-balance-value', '—');
  }
}

async function refreshHeaderBalances() {
  if (typeof ethers !== 'undefined') {
    try {
      await fetchEthUsdPrice(true);
    } catch {
      // Sem cotação: exibe apenas ETH
    }
  }
  await Promise.all([showContractBalance(), showWalletBalance(), showTokenBalance()]);
}

async function showAddressBalance() {
  const to = getDestinationAddress();
  if (!isValidDestinationAddress(to)) {
    setAddressBalanceOutput('Informe um endereço válido para consultar o saldo.');
    return;
  }

  const balanceProvider = getBalanceProvider();
  if (!balanceProvider) {
    setAddressBalanceOutput('Provider indisponível para consultar o saldo.');
    return;
  }

  try {
    try {
      await fetchEthUsdPrice();
    } catch {
      // USD opcional no card
    }

    const balanceWei = await balanceProvider.getBalance(to);
    const ethShort = formatEthShort(balanceWei);
    const usdFull = formatUsdFull(balanceWei);
    const usdBlock = usdFull ? `<span class="address-balance-usd">${usdFull}</span>` : '';

    let tokenBlock = '';
    const tokenC = getTokenContract();
    if (tokenC) {
      try {
        const tokenBal = await tokenC.balanceOf(to);
        tokenBlock = `<span class="address-balance-eth">${formatTokenAmount(tokenBal)}</span>`;
      } catch {
        // ignora falha de leitura do token
      }
    }

    setAddressBalanceOutput(
      `<div class="address-balance-card">` +
        `<span class="address-balance-eth">${ethShort} ETH</span>` +
        usdBlock +
        (tokenBlock ? tokenBlock : '') +
        `</div>`,
      true
    );
  } catch (err) {
    setAddressBalanceOutput(friendlyContractError(err));
  }
}

async function initReadOnlyBalance() {
  if (typeof ethers === 'undefined') {
    setBalanceChipPlaceholder('contract-balance-value', '—');
    return;
  }

  if (!ethers.utils.isAddress(CONTRACT_ADDRESS)) {
    setBalanceChipPlaceholder('contract-balance-value', '—');
    return;
  }

  try {
    readOnlyProvider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
    const bytecode = await readOnlyProvider.getCode(CONTRACT_ADDRESS);
    if (!bytecode || bytecode === '0x') {
      setBalanceChipPlaceholder('contract-balance-value', '—');
      await runHealthCheck();
      return;
    }

    readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, readOnlyProvider);
    try {
      const enabled = await readOnlyContract.enabled();
      applyOperationsEnabledState(enabled);
    } catch {
      applyOperationsEnabledState(true);
    }
    await initReadOnlyToken();
    currentChainId = HARDHAT_LOCAL_CHAIN_ID;
    updateNetworkBadge(HARDHAT_LOCAL_CHAIN_ID);
    await refreshContractOwner();
    await refreshHeaderBalances();
    await refreshLogs();
    setupTransferLogsListener();
    await runHealthCheck();
  } catch (err) {
    setBalanceChipPlaceholder('contract-balance-value', '—');
  }
}

document.getElementById('btn-connect').addEventListener('click', handleWalletButtonClick);
document.getElementById('btn-add-network').addEventListener('click', addHardhatNetworkViaSite);
document.getElementById('transfer-form').addEventListener('submit', transferSubmit);
document.querySelectorAll('input[name="transfer-asset"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    syncTransferAssetUi();
    syncTransferFormAvailability();
  });
});
document
  .getElementById('btn-refresh-token-balance')
  ?.addEventListener('click', refreshHeaderBalances);
document.getElementById('btn-watch-token')?.addEventListener('click', addTokenToMetaMask);
document
  .getElementById('btn-refresh-contract-balance')
  ?.addEventListener('click', refreshHeaderBalances);
document
  .getElementById('btn-refresh-wallet-balance')
  ?.addEventListener('click', refreshHeaderBalances);
document.getElementById('btn-refresh-logs')?.addEventListener('click', refreshLogs);
document.getElementById('btn-refresh-mine')?.addEventListener('click', refreshMyTransfers);
document.getElementById('btn-admin-refresh-wallets')?.addEventListener('click', refreshAdminWalletsList);
document.getElementById('admin-wallet-select')?.addEventListener('change', (event) => {
  const value = event.target.value.trim();
  setAdminSelectedWallet(value || null);
});
document
  .getElementById('admin-enabled-toggle')
  ?.addEventListener('change', onAdminEnabledToggleChange);
document.getElementById('btn-admin-clear')?.addEventListener('click', adminClearWallet);
document.getElementById('btn-admin-prune')?.addEventListener('click', adminPruneWallet);
document.getElementById('btn-admin-clear-all')?.addEventListener('click', adminClearAll);
document.getElementById('btn-admin-withdraw')?.addEventListener('click', adminWithdrawFees);
document.getElementById('btn-admin-withdraw-all')?.addEventListener('click', adminWithdrawFees);
document.getElementById('btn-admin-transfer-owner')?.addEventListener('click', adminTransferOwnership);
document.getElementById('btn-admin-renounce-owner')?.addEventListener('click', adminRenounceOwnership);
document.getElementById('btn-admin-set-max-records')?.addEventListener('click', adminSetMaxRecords);
document.getElementById('btn-admin-token-mint')?.addEventListener('click', adminTokenMint);
document.getElementById('btn-admin-token-burn')?.addEventListener('click', adminTokenBurn);
document.getElementById('btn-admin-token-set-rate')?.addEventListener('click', adminTokenSetRate);
document.getElementById('btn-transfer-via-proxy')?.addEventListener('click', transferEtherViaProxy);
document.getElementById('logs-filter-address')?.addEventListener('input', (event) => {
  logsFilterAddress = event.target.value;
  logsPage = 0;
  renderLogsList();
});
document.getElementById('btn-logs-prev')?.addEventListener('click', () => {
  logsPage -= 1;
  renderLogsList();
});
document.getElementById('btn-logs-next')?.addEventListener('click', () => {
  logsPage += 1;
  renderLogsList();
});
document.getElementById('mine-filter-address')?.addEventListener('input', (event) => {
  mineFilterAddress = event.target.value;
  minePage = 0;
  renderMyTransfersList(myTransfersCache);
});
document.getElementById('btn-mine-prev')?.addEventListener('click', () => {
  minePage -= 1;
  renderMyTransfersList(myTransfersCache);
});
document.getElementById('btn-mine-next')?.addEventListener('click', () => {
  minePage += 1;
  renderMyTransfersList(myTransfersCache);
});

initDestinationAddressField();
initWalletProviderListeners();
initTabs();
initAppFooter();
updateConnectButton();
setTransferActionsEnabled(false);
setBalanceChipPlaceholder('contract-balance-value', '…');
setBalanceChipPlaceholder('wallet-balance-value', '—');
setBalanceChipPlaceholder('token-balance-value', '—');
syncTransferAssetUi();
updateWatchTokenButton();

if (isQueryFlagEnabled('showHardhatNetwork')) {
  document.getElementById('section-site-network')?.removeAttribute('hidden');
}

initReadOnlyBalance().finally(() => {
  tryRestoreWalletSession();
});
