// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/AetherRouter.sol";
import "../src/AetherIntentVault.sol";

contract AetherIntentVaultTest is Test {
    AetherRouter router;
    AetherIntentVault vault;

    address admin = address(0x1);
    address aiAgent = address(0x2);
    address user = address(0x3);

    function setUp() public {
        router = new AetherRouter(aiAgent);
        vault = new AetherIntentVault(aiAgent, address(router));
    }

    function testDepositAndWithdraw() public {
        uint256 depositVal = 1 ether;

        // Deposit
        uint256 shares = vault.deposit{value: depositVal}();
        assertEq(shares, depositVal);
        assertEq(vault.balanceOf(address(this)), depositVal);

        // Withdraw
        uint256 returned = vault.withdraw(depositVal);
        assertEq(returned, depositVal);
        assertEq(vault.balanceOf(address(this)), 0);
    }

    function testIntentRouterExecution() public {
        bytes memory sig = abi.encodePacked("0xaetherx_signed_proof");
        
        uint256 amountOut = router.executeIntentSwap(
            address(0x101),
            address(0x102),
            1000,
            1000,
            1,
            "Swap USDT to ETH and stake",
            sig
        );

        assertEq(amountOut, 1050); // 5% simulated yield output
        assertEq(router.totalSwapsExecuted(), 1);
    }

    function testAIRebalanceAndEmergencyPause() public {
        vault.executeAIRebalance(1250, 85, "High volatility detected on X Layer. Pausing vault.");
        assertTrue(vault.paused());
    }

    receive() external payable {}
}
