/**
 * CLI interativo para operacoes administrativas do EtherTransfer (onlyOwner).
 *
 * Menu navegavel com setas + Enter (inquirer list), no estilo api-tester.
 * Local: usa conta #0 do hardhat node (PRIVATE_KEY opcional no .env).
 *
 * Uso:
 *   npm run admin
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const inquirer = require('inquirer');
const { getSignerFromEnv } = require('./lib/env-wallet');

const DEFAULT_LOCAL_RPC = 'http://127.0.0.1:8545';

const MENU_ACTIONS = [
  { name: '📊 Status — owner, enabled, saldo, carteiras registradas', value: 'status' },
  { name: '🔛 setEnabled — suspender ou reativar transferEther', value: 'setEnabled' },
  {
    name: '📤 transferEther — tx fora do frontend (testar aba Logs)',
    value: 'transferExternal',
  },
  { name: '🗑️  clearTransfersByOrigin — apagar historico de uma carteira', value: 'clear' },
  { name: '✂️  pruneTransfersByOrigin — manter apenas os N registros recentes', value: 'prune' },
  { name: '🧹 clearAllTransfers — zerar todo o historico on-chain', value: 'clearAll' },
  new inquirer.Separator(),
  { name: '👋 Sair', value: 'exit' },
];

function formatError(err) {
  return (
    err?.shortMessage ||
    err?.reason ||
    err?.info?.error?.message ||
    err?.message ||
    String(err)
  );
}

async function connectOwnerContract() {
  const contractAddress = process.env.CONTRACT_ADDRESS?.trim();
  const rpcUrl = process.env.LOCAL_RPC_URL?.trim() || DEFAULT_LOCAL_RPC;

  if (!contractAddress) {
    throw new Error('Defina CONTRACT_ADDRESS no .env (npm run deploy:local).');
  }

  const wallet = await getSignerFromEnv();
  const contract = await ethers.getContractAt('EtherTransfer', contractAddress, wallet);

  return { contract, wallet, contractAddress, rpcUrl };
}

async function showStatus(contract, wallet, contractAddress, rpcUrl) {
  const [owner, enabled, balance, registered] = await Promise.all([
    contract.owner(),
    contract.enabled(),
    contract.getContractBalance(),
    contract.getRegisteredWalletCount(),
  ]);

  console.log('\n--- Status ---');
  console.log('RPC:              ', rpcUrl);
  console.log('Contrato:         ', contractAddress);
  console.log('Sua carteira:     ', wallet.address);
  console.log('Owner on-chain:   ', owner);
  console.log('Voce e o owner?   ', owner.toLowerCase() === wallet.address.toLowerCase() ? 'sim' : 'NAO');
  console.log('Operacoes ativas? ', enabled ? 'sim (enabled)' : 'nao (suspenso)');
  console.log('Saldo contrato:   ', ethers.formatEther(balance), 'ETH');
  console.log('Carteiras c/ hist.', registered.toString());
  console.log('----------------\n');
}

async function waitTx(label, tx) {
  console.log(`${label}: tx ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`Confirmada no bloco ${receipt.blockNumber}\n`);
}

async function pickAction() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Operacao administrativa (↑↓ Enter)',
      choices: MENU_ACTIONS,
      pageSize: 12,
      loop: false,
    },
  ]);
  return action;
}

async function promptWalletAddress(message) {
  const { wallet } = await inquirer.prompt([
    {
      type: 'input',
      name: 'wallet',
      message,
      validate: (input) => (ethers.isAddress(input.trim()) ? true : 'Endereco invalido'),
    },
  ]);
  return wallet.trim();
}

async function runTransferExternal(contract, wallet) {
  const signers = await ethers.getSigners();
  const defaultTo = signers[1]?.address ?? '';
  const defaultAmount = process.env.TRANSFER_AMOUNT_ETH?.trim() || '0.05';

  const { to } = await inquirer.prompt([
    {
      type: 'input',
      name: 'to',
      message: 'Destino (endereco):',
      default: defaultTo,
      validate: (input) => (ethers.isAddress(input.trim()) ? true : 'Endereco invalido'),
    },
  ]);

  const { amountEth } = await inquirer.prompt([
    {
      type: 'input',
      name: 'amountEth',
      message: 'Valor em ETH:',
      default: defaultAmount,
      validate: (input) => {
        const n = Number(input.trim());
        return Number.isFinite(n) && n > 0 ? true : 'Informe um numero maior que zero';
      },
    },
  ]);

  const recipient = to.trim();
  const amount = amountEth.trim();

  console.log('\nRemetente:', wallet.address);
  console.log('Destino:  ', recipient);
  console.log('Valor:    ', amount, 'ETH\n');

  const tx = await contract.connect(wallet).transferEther(recipient, {
    value: ethers.parseEther(amount),
  });
  await waitTx('transferEther (externo ao frontend)', tx);
  console.log(
    'Abra a aba Logs no frontend — o evento TransferExecuted deve aparecer em tempo real ou apos Atualizar logs.\n'
  );
}

async function runSetEnabled(contract) {
  const { enabled } = await inquirer.prompt([
    {
      type: 'list',
      name: 'enabled',
      message: 'Operacoes publicas (transferEther)',
      choices: [
        { name: '✅ Ativar transferEther', value: true },
        { name: '⛔ Suspender transferEther', value: false },
      ],
    },
  ]);
  const tx = await contract.setEnabled(enabled);
  await waitTx(`setEnabled(${enabled})`, tx);
}

async function runClear(contract) {
  const wallets = await contract.getRegisteredWallets();
  if (wallets.length === 0) {
    console.log('Nenhuma carteira registrada em transfersByOrigin.\n');
    return;
  }

  const choices = wallets.map((w) => ({ name: w, value: w }));
  choices.push(new inquirer.Separator(), { name: 'Outro endereco…', value: '__other__' });

  const { walletChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'walletChoice',
      message: 'Carteira (tx.origin) — getRegisteredWallets()',
      choices,
      pageSize: 12,
    },
  ]);

  const wallet =
    walletChoice === '__other__'
      ? await promptWalletAddress('Endereco da carteira (tx.origin):')
      : walletChoice;

  const tx = await contract.clearTransfersByOrigin(wallet);
  await waitTx(`clearTransfersByOrigin(${wallet})`, tx);
}

async function runPrune(contract) {
  const wallets = await contract.getRegisteredWallets();
  let wallet;

  if (wallets.length === 0) {
    wallet = await promptWalletAddress('Endereco da carteira (tx.origin):');
  } else {
    const choices = wallets.map((w) => ({ name: w, value: w }));
    choices.push(new inquirer.Separator(), { name: 'Outro endereco…', value: '__other__' });
    const { walletChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'walletChoice',
        message: 'Carteira (tx.origin) — getRegisteredWallets()',
        choices,
        pageSize: 12,
      },
    ]);
    wallet =
      walletChoice === '__other__'
        ? await promptWalletAddress('Endereco da carteira (tx.origin):')
        : walletChoice;
  }

  const { keepLast } = await inquirer.prompt([
    {
      type: 'input',
      name: 'keepLast',
      message: 'Quantos registros recentes manter (N > 0):',
      validate: (input) => {
        const n = BigInt(input.trim() || '0');
        return n > 0n ? true : 'Informe um numero inteiro maior que zero';
      },
    },
  ]);
  const tx = await contract.pruneTransfersByOrigin(wallet, BigInt(keepLast.trim()));
  await waitTx(`pruneTransfersByOrigin(${wallet}, ${keepLast.trim()})`, tx);
}

async function runClearAll(contract) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Apagar TODO o historico on-chain? Esta acao nao desfaz eventos antigos.',
      default: false,
    },
  ]);
  if (!confirm) {
    console.log('Cancelado.\n');
    return;
  }
  const tx = await contract.clearAllTransfers();
  await waitTx('clearAllTransfers()', tx);
}

async function handleAction(action, ctx) {
  switch (action) {
    case 'status':
      await showStatus(ctx.contract, ctx.wallet, ctx.contractAddress, ctx.rpcUrl);
      break;
    case 'setEnabled':
      await runSetEnabled(ctx.contract);
      break;
    case 'transferExternal':
      await runTransferExternal(ctx.contract, ctx.wallet);
      break;
    case 'clear':
      await runClear(ctx.contract);
      break;
    case 'prune':
      await runPrune(ctx.contract);
      break;
    case 'clearAll':
      await runClearAll(ctx.contract);
      break;
    case 'exit':
      return false;
    default:
      console.log('Opcao desconhecida.\n');
  }
  return true;
}

async function runMenu() {
  let ctx;

  try {
    ctx = await connectOwnerContract();
    console.log('\nEtherTransfer — CLI administrativo (onlyOwner)\n');
    await showStatus(ctx.contract, ctx.wallet, ctx.contractAddress, ctx.rpcUrl);

    const owner = await ctx.contract.owner();
    if (owner.toLowerCase() !== ctx.wallet.address.toLowerCase()) {
      console.warn(
        'AVISO: PRIVATE_KEY no .env nao e o owner deste contrato.\n' +
          `  Owner on-chain: ${owner}\n` +
          `  Sua carteira:   ${ctx.wallet.address}\n` +
          '  Rode npm run deploy:local com a mesma PRIVATE_KEY ou use a chave da conta #0 do Hardhat (.env.example).\n'
      );
    }
  } catch (err) {
    console.error(formatError(err));
    process.exit(1);
  }

  let running = true;
  while (running) {
    try {
      const action = await pickAction();
      running = await handleAction(action, ctx);
      if (!running) {
        console.log('Encerrando.');
      }
    } catch (err) {
      console.error('Erro:', formatError(err), '\n');
    }
  }
}

runMenu().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
