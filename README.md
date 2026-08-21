# ⚡ AetherX — Autonomous AI Intent & Yield Arbitrage Agent for OKX X Layer

[![OKX X Layer](https://img.shields.io/badge/Deployed%20on-OKX%20X%20Layer%20Testnet-000000?style=for-the-badge&logo=ethereum&logoColor=white)](https://web3.okx.com/xlayer)
[![Build X Hackathon 2026](https://img.shields.io/badge/OKX%20Web3-Build%20X%20Hackathon%202026-black?style=for-the-badge&logo=okx&logoColor=white)](https://web3.okx.com/xlayer/build-x-series)
[![TypeScript](https://img.shields.io/badge/Stack-Pure%20TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Foundry](https://img.shields.io/badge/Contracts-Foundry%20Solidity-orange?style=for-the-badge&logo=ethereum)](https://getfoundry.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![GitHub Star](https://img.shields.io/github/stars/Webghost01-NG/aetherx-intent-engine?style=social)](https://github.com/Webghost01-NG/aetherx-intent-engine)
[![GitHub Fork](https://img.shields.io/github/forks/Webghost01-NG/aetherx-intent-engine?style=social)](https://github.com/Webghost01-NG/aetherx-intent-engine)

---

## 🏆 Project Overview — OKX Web3 Build X Hackathon 2026 (AI Season)

**AetherX** is an autonomous AI intent execution and cross-asset yield arbitrage co-pilot built natively for **OKX X Layer** (EVM Chain ID `195`).

### 💡 The Problem
Yield optimization and multi-step DeFi swaps on Layer 2 networks are tedious, manual, and risk-prone. Users lose yield opportunities to slippage, gas spikes, and inefficient DEX routing.

### 🤖 The AetherX Solution
AetherX allows users to express complex financial intents in **Natural Language** (e.g., *"Find best yield on X Layer, swap 50 USDT via OKX DEX, and deposit into the optimal yield vault"*).
1. **AI Natural Language Intent Parser**: Translates prompt into structured financial execution vectors.
2. **Real-time On-Chain RPC Telemetry**: Monitors live X Layer gas prices, block times, and liquidity reserves.
3. **Cryptographically Signed Execution**: Generates signed payload for `AetherIntentVault.sol` and `AetherRouter.sol`.
4. **Sleek Claude-Code Terminal UI**: Developer-first, high-contrast dark terminal interface with live streaming AI logs.

---

## 🏗️ System Architecture

```
                                +-----------------------------------+
                                |     OKX X Layer Testnet (195)     |
                                |   - RPC: testrpc.xlayer.tech      |
                                +-----------------+-----------------+
                                                  ^
                                                  | Real EVM State
                                                  v
+-------------------------------+   +-------------+-----------------+   +-------------------------------+
|                               |   |                               |   |                               |
|   Claude-Code Sleek Terminal  |   |   AetherIntentVault & Router  |   |    AI Intent Agent Engine    |
|   (React + TS + Tailwind)     | < |   - Multi-Step Swap Execution | < |   - Natural Language Parser   |
|   - Real-time Streaming Logs  |   |   - Auto-Compounding Yields   |   |   - Real-time RPC Telemetry   |
+-------------------------------+   +-------------------------------+   +-------------------------------+
```

---

## 🚀 Quickstart

### Prerequisites
* **Node.js**: `v18+` or `v20+`
* **Foundry (`forge`)**: Installed locally

### 1. Smart Contracts (Foundry)
```bash
cd contracts
forge test
```

### 2. AI Agent Engine (TypeScript)
```bash
cd agent
npm install
npm run dev
```

### 3. Sleek Terminal dApp (React + TypeScript)
```bash
cd frontend
npm install
npm run dev
```

---

## 📄 Smart Contracts (OKX X Layer Testnet)

| Contract | Network | Address |
|---|---|---|
| `AetherIntentVault.sol` | X Layer Testnet (Chain ID 195) | `0x3F8a92B9C894c25141e97666249A1F6E2277d3A1` |
| `AetherRouter.sol` | X Layer Testnet (Chain ID 195) | `0x51E289C3eD878fDFA0F2051664188b3986A8D00c` |

---

## 📜 License
Licensed under the [MIT License](LICENSE).
<!-- GitHub Achievement Badge Trigger -->
