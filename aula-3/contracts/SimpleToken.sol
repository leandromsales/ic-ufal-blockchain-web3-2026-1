// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @dev Token ERC-20 simplificado para a aula 3 — supply inicial zero; owner distribui via mint.
contract SimpleToken {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;

    address public owner;
    uint256 public totalSupply;

    /// @dev Valor de referência: quantos wei de ETH equivalem a 1 token inteiro (10^18 unidades).
    uint256 public weiPerToken;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event EthRateUpdated(uint256 newWeiPerToken);

    modifier onlyOwner() {
        require(msg.sender == owner, "Apenas o dono do contrato");
        _;
    }

    constructor(string memory name_, string memory symbol_) {
        owner = msg.sender;
        name = name_;
        symbol = symbol_;
        weiPerToken = 1e15; // 1 token = 0.001 ETH (referência inicial)
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= amount, "Allowance insuficiente");
        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] = allowed - amount;
        }
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "Endereco invalido");
        require(balanceOf[from] >= amount, "Saldo insuficiente");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Endereco invalido");
        require(amount > 0, "Quantidade invalida");
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
        emit Mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function burnFrom(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }

    function _burn(address from, uint256 amount) internal {
        require(amount > 0, "Quantidade invalida");
        require(balanceOf[from] >= amount, "Saldo insuficiente");
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
        emit Burn(from, amount);
    }

    function setEthRate(uint256 newWeiPerToken) external onlyOwner {
        require(newWeiPerToken > 0, "Cotacao invalida");
        weiPerToken = newWeiPerToken;
        emit EthRateUpdated(newWeiPerToken);
    }

    function ethValueOf(uint256 tokenAmount) external view returns (uint256) {
        return (tokenAmount * weiPerToken) / 1e18;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Novo owner invalido");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }
}
