const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SimpleToken', function () {
  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const SimpleToken = await ethers.getContractFactory('SimpleToken');
    const token = await SimpleToken.deploy('Aula Token', 'AULA');
    return { token, owner, alice, bob };
  }

  it('inicia sem supply e com cotacao padrao', async function () {
    const { token, owner } = await deployFixture();
    expect(await token.owner()).to.equal(owner.address);
    expect(await token.totalSupply()).to.equal(0n);
    expect(await token.balanceOf(owner.address)).to.equal(0n);
    expect(await token.weiPerToken()).to.equal(ethers.parseEther('0.001'));
  });

  it('mint distribui tokens apenas pelo owner', async function () {
    const { token, owner, alice } = await deployFixture();
    const amount = ethers.parseEther('100');

    await expect(token.connect(alice).mint(alice.address, amount)).to.be.revertedWith(
      'Apenas o dono do contrato'
    );

    await token.connect(owner).mint(alice.address, amount);

    expect(await token.totalSupply()).to.equal(amount);
    expect(await token.balanceOf(alice.address)).to.equal(amount);
  });

  it('transfer move saldo entre carteiras', async function () {
    const { token, owner, alice, bob } = await deployFixture();
    const amount = ethers.parseEther('50');
    await token.connect(owner).mint(alice.address, amount);

    await token.connect(alice).transfer(bob.address, ethers.parseEther('20'));

    expect(await token.balanceOf(alice.address)).to.equal(ethers.parseEther('30'));
    expect(await token.balanceOf(bob.address)).to.equal(ethers.parseEther('20'));
  });

  it('burnFrom remove tokens e atualiza supply', async function () {
    const { token, owner, alice } = await deployFixture();
    const amount = ethers.parseEther('10');
    await token.connect(owner).mint(alice.address, amount);

    await token.connect(owner).burnFrom(alice.address, ethers.parseEther('4'));

    expect(await token.balanceOf(alice.address)).to.equal(ethers.parseEther('6'));
    expect(await token.totalSupply()).to.equal(ethers.parseEther('6'));
  });

  it('setEthRate atualiza cotacao e ethValueOf', async function () {
    const { token, owner } = await deployFixture();
    const newRate = ethers.parseEther('0.01');
    await token.connect(owner).setEthRate(newRate);

    expect(await token.weiPerToken()).to.equal(newRate);
    expect(await token.ethValueOf(ethers.parseEther('2'))).to.equal(ethers.parseEther('0.02'));
  });
});
