// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EtherTransfer {
    uint256 public constant FEE_PERCENT = 5;

    address public owner;
    bool public enabled;
    uint256 public maxRecordsPerWallet;

    struct TransferRecord {
        address from;
        address to;
        uint256 value;
        uint256 fee;
    }

    /// @dev Chave: carteira que iniciou a transacao (tx.origin).
    mapping(address => TransferRecord[]) public transfersByOrigin;

    address[] private _walletsWithTransfers;
    mapping(address => bool) private _walletRegistered;

    event TransferExecuted(
        address indexed from,
        address indexed to,
        uint256 value,
        uint256 fee
    );

    event OperationsStatusChanged(bool enabled);

    event TransfersCleared(address indexed wallet);

    event TransfersPruned(address indexed wallet, uint256 keptCount);

    event AllTransfersCleared(uint256 walletsCleared);

    event FeesWithdrawn(address indexed to, uint256 amount);

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    event MaxRecordsPerWalletUpdated(uint256 newMax);

    modifier onlyOwner() {
        require(msg.sender == owner, "Apenas o dono do contrato");
        _;
    }

    modifier onlyEnabled() {
        require(enabled, "Operacoes publicas suspensas");
        _;
    }

    constructor() {
        owner = msg.sender;
        enabled = true;
        maxRecordsPerWallet = 50;
    }

    function _registerWallet(address wallet) private {
        if (_walletRegistered[wallet]) {
            return;
        }
        _walletRegistered[wallet] = true;
        _walletsWithTransfers.push(wallet);
    }

    function _unregisterWallet(address wallet) private {
        if (!_walletRegistered[wallet]) {
            return;
        }
        _walletRegistered[wallet] = false;

        uint256 len = _walletsWithTransfers.length;
        for (uint256 i = 0; i < len; i++) {
            if (_walletsWithTransfers[i] == wallet) {
                _walletsWithTransfers[i] = _walletsWithTransfers[len - 1];
                _walletsWithTransfers.pop();
                return;
            }
        }
    }

    function _enforceMaxRecords(address wallet) private {
        TransferRecord[] storage list = transfersByOrigin[wallet];
        while (list.length > maxRecordsPerWallet) {
            uint256 len = list.length;
            for (uint256 i = 0; i < len - 1; i++) {
                list[i] = list[i + 1];
            }
            list.pop();
        }
    }

    function transferEther(address payable to) external payable onlyEnabled {
        require(to != address(0), "Endereco invalido");
        require(msg.value > 0, "Envie algum valor em wei");

        uint256 fee = (msg.value * FEE_PERCENT) / 100;
        uint256 amount = msg.value - fee;

        (bool success, ) = to.call{value: amount}("");
        require(success, "Falha na transferencia");

        address initiator = tx.origin;

        TransferRecord memory record = TransferRecord({
            from: initiator,
            to: to,
            value: amount,
            fee: fee
        });

        _registerWallet(initiator);
        transfersByOrigin[initiator].push(record);
        _enforceMaxRecords(initiator);

        emit TransferExecuted(record.from, record.to, record.value, record.fee);
    }

    function getTransfersByOrigin(
        address wallet
    ) external view returns (TransferRecord[] memory) {
        return transfersByOrigin[wallet];
    }

    function getTransferCountByOrigin(
        address wallet
    ) external view returns (uint256) {
        return transfersByOrigin[wallet].length;
    }

    function setEnabled(bool newEnabled) external onlyOwner {
        enabled = newEnabled;
        emit OperationsStatusChanged(newEnabled);
    }

    function setMaxRecordsPerWallet(uint256 newMax) external onlyOwner {
        require(newMax > 0, "Maximo deve ser maior que zero");
        maxRecordsPerWallet = newMax;
        emit MaxRecordsPerWalletUpdated(newMax);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Novo owner invalido");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function renounceOwnership() external onlyOwner {
        address previousOwner = owner;
        owner = address(0);
        emit OwnershipTransferred(previousOwner, address(0));
    }

    function withdrawFees(
        address payable to,
        uint256 amount
    ) external onlyOwner {
        require(to != address(0), "Destino invalido");
        require(amount > 0, "Valor deve ser maior que zero");
        require(
            amount <= address(this).balance,
            "Saldo insuficiente no contrato"
        );

        (bool success, ) = to.call{value: amount}("");
        require(success, "Falha no saque");

        emit FeesWithdrawn(to, amount);
    }

    function withdrawAllFees(address payable to) external onlyOwner {
        require(to != address(0), "Destino invalido");
        uint256 amount = address(this).balance;
        require(amount > 0, "Nenhuma taxa acumulada");

        (bool success, ) = to.call{value: amount}("");
        require(success, "Falha no saque");

        emit FeesWithdrawn(to, amount);
    }

    function clearTransfersByOrigin(address wallet) external onlyOwner {
        delete transfersByOrigin[wallet];
        _unregisterWallet(wallet);
        emit TransfersCleared(wallet);
    }

    function pruneTransfersByOrigin(
        address wallet,
        uint256 keepLast
    ) external onlyOwner {
        require(keepLast > 0, "Use clearTransfersByOrigin para remover tudo");

        TransferRecord[] storage list = transfersByOrigin[wallet];
        uint256 len = list.length;
        if (len <= keepLast) {
            return;
        }

        uint256 start = len - keepLast;
        for (uint256 i = 0; i < keepLast; i++) {
            list[i] = list[start + i];
        }
        while (list.length > keepLast) {
            list.pop();
        }

        emit TransfersPruned(wallet, keepLast);
    }

    function clearAllTransfers() external onlyOwner {
        uint256 n = _walletsWithTransfers.length;
        for (uint256 i = 0; i < n; i++) {
            address w = _walletsWithTransfers[i];
            delete transfersByOrigin[w];
            _walletRegistered[w] = false;
        }
        delete _walletsWithTransfers;
        emit AllTransfersCleared(n);
    }

    function getRegisteredWalletCount() external view returns (uint256) {
        return _walletsWithTransfers.length;
    }

    function getRegisteredWallets() external view returns (address[] memory) {
        return _walletsWithTransfers;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
