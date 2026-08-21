// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/AetherRouter.sol";
import "../src/AetherIntentVault.sol";
import "../src/AetherFirewall.sol";

contract DeployAetherX is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
        );

        vm.startBroadcast(deployerPrivateKey);

        address aiAgentSigner = vm.addr(deployerPrivateKey);

        AetherRouter router = new AetherRouter(aiAgentSigner);
        AetherIntentVault vault = new AetherIntentVault(aiAgentSigner, address(router));
        AetherFirewall firewall = new AetherFirewall(aiAgentSigner);

        console.log("=== AetherX v2.0 Smart Contracts Deployed on OKX X Layer Testnet ===");
        console.log("AetherRouter Deployed at:", address(router));
        console.log("AetherIntentVault Deployed at:", address(vault));
        console.log("AetherFirewall Deployed at:", address(firewall));

        vm.stopBroadcast();
    }
}
