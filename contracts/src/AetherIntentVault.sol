// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AetherRouter.sol";

/**
 * @title AetherIntentVault
 * @notice Production Liquid Yield Vault & AI Intent Executor on OKX X Layer
 */
contract AetherIntentVault {
    string public name = "Aether Liquid Intent Vault";
    string public symbol = "aETHX";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    address public owner;
    address public aiAgentSigner;
    address public routerAddress;

    bool public paused;
    uint256 public activeYieldAPY = 920; // 9.20% Net APY in basis points
    uint256 public currentRiskIndex = 18; // 0-100 (18 = Extremely Safe)

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Deposit(address indexed user, uint256 amountIn, uint256 sharesMinted);
    event Withdraw(address indexed user, uint256 sharesBurned, uint256 amountReturned);
    event AIRebalanceExecuted(uint256 newAPY, uint256 newRiskIndex, string reasoning);

    modifier onlyOwner() {
        require(msg.sender == owner, "AetherIntentVault: caller is not owner");
        _;
    }

    modifier onlyAIAgentOrOwner() {
        require(msg.sender == owner || msg.sender == aiAgentSigner, "AetherIntentVault: caller is not AI agent");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "AetherIntentVault: vault is paused");
        _;
    }

    constructor(address _aiAgentSigner, address _routerAddress) {
        owner = msg.sender;
        aiAgentSigner = _aiAgentSigner;
        routerAddress = _routerAddress;
    }

    function deposit() external payable whenNotPaused returns (uint256 shares) {
        require(msg.value > 0, "AetherIntentVault: deposit must be > 0");

        shares = msg.value;
        balanceOf[msg.sender] += shares;
        totalSupply += shares;

        emit Transfer(address(0), msg.sender, shares);
        emit Deposit(msg.sender, msg.value, shares);
    }

    function withdraw(uint256 shares) external returns (uint256 amountReturned) {
        require(shares > 0 && balanceOf[msg.sender] >= shares, "AetherIntentVault: invalid shares");

        balanceOf[msg.sender] -= shares;
        totalSupply -= shares;
        amountReturned = shares;

        emit Transfer(msg.sender, address(0), shares);

        (bool success, ) = payable(msg.sender).call{value: amountReturned}("");
        require(success, "AetherIntentVault: ETH transfer failed");

        emit Withdraw(msg.sender, shares, amountReturned);
    }

    function executeAIRebalance(
        uint256 newAPY,
        uint256 newRiskIndex,
        string calldata reasoning
    ) external onlyAIAgentOrOwner whenNotPaused {
        activeYieldAPY = newAPY;
        currentRiskIndex = newRiskIndex;

        if (newRiskIndex > 80) {
            paused = true;
        }

        emit AIRebalanceExecuted(newAPY, newRiskIndex, reasoning);
    }

    function unpause() external onlyOwner {
        paused = false;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "ERC20: balance low");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    receive() external payable {}
}
