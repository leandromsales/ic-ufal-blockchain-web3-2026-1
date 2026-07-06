// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./EtherTransfer.sol";

/// @dev Contrato intermediario para demonstrar msg.sender vs tx.origin.
/// Quem chama transferEther via proxy e o proxy (msg.sender), nao a carteira do usuario.
contract TransferProxy {
    EtherTransfer public immutable etherTransfer;

    event ProxyTransfer(address indexed user, address indexed to, uint256 value);

    constructor(address payable etherTransferAddress) {
        require(etherTransferAddress != address(0), "Endereco invalido");
        etherTransfer = EtherTransfer(etherTransferAddress);
    }

    function proxyTransfer(address payable to) external payable {
        require(to != address(0), "Endereco invalido");
        require(msg.value > 0, "Envie algum valor em wei");

        etherTransfer.transferEther{value: msg.value}(to);
        emit ProxyTransfer(msg.sender, to, msg.value);
    }
}
