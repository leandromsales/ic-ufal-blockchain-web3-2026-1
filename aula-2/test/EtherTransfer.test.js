const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('EtherTransfer', function () {
  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const EtherTransfer = await ethers.getContractFactory('EtherTransfer');
    const contract = await EtherTransfer.deploy();
    return { contract, owner, alice, bob };
  }

  it('define owner no deploy e inicia enabled', async function () {
    const { contract, owner } = await deployFixture();
    expect(await contract.owner()).to.equal(owner.address);
    expect(await contract.enabled()).to.equal(true);
    expect(await contract.maxRecordsPerWallet()).to.equal(50n);
  });

  it('transferEther envia liquido e acumula taxa de 5%', async function () {
    const { contract, alice, bob } = await deployFixture();
    const value = ethers.parseEther('1');
    const beforeBob = await ethers.provider.getBalance(bob.address);

    await contract.connect(alice).transferEther(bob.address, { value });

    const afterBob = await ethers.provider.getBalance(bob.address);
    expect(afterBob - beforeBob).to.equal(ethers.parseEther('0.95'));
    expect(await contract.getContractBalance()).to.equal(ethers.parseEther('0.05'));

    const records = await contract.getTransfersByOrigin(alice.address);
    expect(records.length).to.equal(1);
    expect(records[0].to).to.equal(bob.address);
    expect(records[0].value).to.equal(ethers.parseEther('0.95'));
    expect(records[0].fee).to.equal(ethers.parseEther('0.05'));
  });

  it('reverte para destino zero ou valor zero', async function () {
    const { contract, alice, bob } = await deployFixture();

    await expect(
      contract.connect(alice).transferEther(ethers.ZeroAddress, {
        value: ethers.parseEther('0.1'),
      })
    ).to.be.revertedWith('Endereco invalido');

    await expect(
      contract.connect(alice).transferEther(bob.address, { value: 0 })
    ).to.be.revertedWith('Envie algum valor em wei');
  });

  it('suspende transferencias quando enabled=false', async function () {
    const { contract, owner, alice, bob } = await deployFixture();

    await contract.connect(owner).setEnabled(false);

    await expect(
      contract.connect(alice).transferEther(bob.address, {
        value: ethers.parseEther('0.1'),
      })
    ).to.be.revertedWith('Operacoes publicas suspensas');
  });

  it('aplica onlyOwner em setEnabled', async function () {
    const { contract, alice } = await deployFixture();

    await expect(contract.connect(alice).setEnabled(false)).to.be.revertedWith(
      'Apenas o dono do contrato'
    );
  });

  it('clearTransfersByOrigin remove historico e indice', async function () {
    const { contract, owner, alice, bob } = await deployFixture();

    await contract.connect(alice).transferEther(bob.address, {
      value: ethers.parseEther('0.2'),
    });
    expect(await contract.getRegisteredWalletCount()).to.equal(1n);

    await contract.connect(owner).clearTransfersByOrigin(alice.address);

    expect(await contract.getTransferCountByOrigin(alice.address)).to.equal(0n);
    expect(await contract.getRegisteredWalletCount()).to.equal(0n);
  });

  it('pruneTransfersByOrigin mantem apenas os ultimos N registros', async function () {
    const { contract, owner, alice, bob } = await deployFixture();

    for (let i = 0; i < 5; i++) {
      await contract.connect(alice).transferEther(bob.address, {
        value: ethers.parseEther('0.01'),
      });
    }
    expect(await contract.getTransferCountByOrigin(alice.address)).to.equal(5n);

    await contract.connect(owner).pruneTransfersByOrigin(alice.address, 2);

    const records = await contract.getTransfersByOrigin(alice.address);
    expect(records.length).to.equal(2);
  });

  it('aplica FIFO quando excede maxRecordsPerWallet', async function () {
    const { contract, owner, alice, bob } = await deployFixture();

    await contract.connect(owner).setMaxRecordsPerWallet(2);

    for (let i = 0; i < 3; i++) {
      await contract.connect(alice).transferEther(bob.address, {
        value: ethers.parseEther('0.01'),
      });
    }

    const records = await contract.getTransfersByOrigin(alice.address);
    expect(records.length).to.equal(2);
  });

  it('withdrawAllFees envia taxas acumuladas ao destino', async function () {
    const { contract, owner, alice, bob } = await deployFixture();

    await contract.connect(alice).transferEther(bob.address, {
      value: ethers.parseEther('1'),
    });

    const beforeOwner = await ethers.provider.getBalance(owner.address);
    const tx = await contract.connect(owner).withdrawAllFees(owner.address);
    const receipt = await tx.wait();
    const gasCost = receipt.gasUsed * receipt.gasPrice;
    const afterOwner = await ethers.provider.getBalance(owner.address);

    expect(afterOwner + gasCost - beforeOwner).to.equal(ethers.parseEther('0.05'));
    expect(await contract.getContractBalance()).to.equal(0n);
  });

  it('transferOwnership permite que o novo owner chame funcoes admin', async function () {
    const { contract, owner, alice } = await deployFixture();

    await contract.connect(owner).transferOwnership(alice.address);
    expect(await contract.owner()).to.equal(alice.address);

    await expect(contract.connect(alice).setEnabled(false)).not.to.be.reverted;
    expect(await contract.enabled()).to.equal(false);
  });
});

describe('TransferProxy', function () {
  it('proxyTransfer registra historico em tx.origin, nao no proxy', async function () {
    const [owner, alice, bob] = await ethers.getSigners();
    const EtherTransfer = await ethers.getContractFactory('EtherTransfer');
    const etherTransfer = await EtherTransfer.deploy();

    const TransferProxy = await ethers.getContractFactory('TransferProxy');
    const proxy = await TransferProxy.deploy(await etherTransfer.getAddress());

    await proxy.connect(alice).proxyTransfer(bob.address, {
      value: ethers.parseEther('0.1'),
    });

    const aliceRecords = await etherTransfer.getTransfersByOrigin(alice.address);
    expect(aliceRecords.length).to.equal(1);
    expect(aliceRecords[0].from).to.equal(alice.address);

    const proxyRecords = await etherTransfer.getTransfersByOrigin(await proxy.getAddress());
    expect(proxyRecords.length).to.equal(0);
  });
});
