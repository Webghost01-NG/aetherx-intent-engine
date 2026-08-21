// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/AetherRouter.sol";
import "../src/AetherIntentVault.sol";
import "../src/AetherFirewall.sol";

contract AetherIntentVaultTest is Test {
    AetherRouter router;
    AetherIntentVault vault;
    AetherFirewall firewall;

    address admin = address(0x1);
    address aiAgent = address(0x2);
    address user = address(0x3);

    function setUp() public {
        router = new AetherRouter(aiAgent);
        vault = new AetherIntentVault(aiAgent, address(router));
        firewall = new AetherFirewall(aiAgent);
    }

    function testDepositAndWithdraw() public {
        uint256 depositVal = 1 ether;

        uint256 shares = vault.deposit{value: depositVal}();
        assertEq(shares, depositVal);
        assertEq(vault.balanceOf(address(this)), depositVal);

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

        assertEq(amountOut, 1050);
        assertEq(router.totalSwapsExecuted(), 1);
    }

    function testFirewallPreExecutionApproved() public {
        (bytes32 hash, AetherFirewall.FirewallVerdict verdict) = firewall.verifyPreExecution(
            address(vault),
            1 ether,
            100, // 1% slippage
            15,  // Low risk score
            "Pre-execution Gate: Trade within safe liquidity and slippage bounds."
        );

        assertTrue(hash != bytes32(0));
        assertTrue(verdict == AetherFirewall.FirewallVerdict.APPROVED);
    }

    function testFirewallPreExecutionBlocked() public {
        (, AetherFirewall.FirewallVerdict verdict) = firewall.verifyPreExecution(
            address(vault),
            10 ether,
            800, // 8% slippage -> EXCEEDS 5% MAXIMUM
            90,  // High risk score -> EXCEEDS SAFETY LIMIT
            "Pre-execution Gate: Excessive slippage & anomaly risk detected! BLOCKED."
        );

        assertTrue(verdict == AetherFirewall.FirewallVerdict.BLOCKED);
        assertEq(firewall.totalBlockedAttacks(), 1);
    }

    receive() external payable {}
}
