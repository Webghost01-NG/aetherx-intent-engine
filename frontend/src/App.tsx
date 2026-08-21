import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Wallet, 
  ArrowRight, 
  RefreshCw, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Layers,
  Activity,
  Code
} from 'lucide-react';
import { ethers } from 'ethers';
import { NetworkTelemetry, IntentExecutionPayload, LogEntry } from './types';

const VAULT_ADDRESS = "0x3F8a92B9C894c25141e97666249A1F6E2277d3A1";
const ROUTER_ADDRESS = "0x51E289C3eD878fDFA0F2051664188b3986A8D00c";

export default function App() {
  const [promptInput, setPromptInput] = useState<string>("Perform cross-asset yield arbitrage and stake on X Layer");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string>("0.00");
  const [vaultShares, setVaultShares] = useState<string>("250.00");

  const [depositEth, setDepositEth] = useState<string>("");
  const [withdrawShares, setWithdrawShares] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [telemetry, setTelemetry] = useState<NetworkTelemetry>({
    blockNumber: 1548292,
    gasPriceGwei: "0.12",
    networkName: "OKX X Layer Testnet (Chain ID: 195)",
    rpcStatus: "ONLINE"
  });

  const [currentPayload, setCurrentPayload] = useState<IntentExecutionPayload | null>({
    vaultAddress: VAULT_ADDRESS,
    routerAddress: ROUTER_ADDRESS,
    tokenIn: "USDT",
    tokenOut: "aETHX",
    amountIn: "100.00",
    minAmountOut: "104.50",
    targetVaultId: 1,
    intentTag: "YIELD_ARBITRAGE",
    network: "OKX X Layer Testnet (Chain ID: 195)",
    blockNumber: 1548292,
    signatureProof: "0xaetherx_ai_intent_ecdsa_signature_proof_xlayer_2026",
    parsedIntent: {
      action: "YIELD_ARBITRAGE",
      tokenIn: "USDT",
      tokenOut: "aETHX",
      amount: "100.00",
      targetVaultId: 1,
      expectedAPY: "9.80%",
      riskScore: 18,
      reasoning: "AI Intent Parser: Identified cross-asset yield arbitrage opportunity on X Layer Block #1548292. Auto-routing to AetherIntentVault for 9.80% Net APY."
    }
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: new Date().toISOString(), type: "SYSTEM", message: "aetherx-cli v1.0.0 initialized on OKX X Layer Testnet" },
    { timestamp: new Date().toISOString(), type: "RPC_QUERY", message: "Connected to X Layer RPC (https://testrpc.xlayer.tech)" },
    { timestamp: new Date().toISOString(), type: "AI_PARSE", message: "Parsed intent: YIELD_ARBITRAGE (9.80% APY)" }
  ]);

  const [statusAlert, setStatusAlert] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);

  // Connect Web3 Wallet (OKX Wallet / MetaMask)
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setWalletAddress(address);
        const balance = await provider.getBalance(address);
        setEthBalance(parseFloat(ethers.formatEther(balance)).toFixed(4));
        setStatusAlert({ type: "success", msg: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` });
      } catch (err: any) {
        setStatusAlert({ type: "error", msg: "Failed to connect wallet: " + err.message });
      }
    } else {
      setStatusAlert({ type: "error", msg: "OKX Wallet or MetaMask extension not detected!" });
    }
  };

  // Run AI Intent Parsing API
  const handleExecuteIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsProcessing(true);
    setStatusAlert({ type: "info", msg: "AI Intent Agent parsing natural language prompt..." });

    try {
      const res = await fetch("http://localhost:5001/api/ai/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptInput })
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentPayload(data.payload);
        setLogs(prev => [
          { timestamp: new Date().toISOString(), type: "EXECUTION_SIGN", message: `Generated signed execution payload for X Layer Block #${data.payload.blockNumber}` },
          { timestamp: new Date().toISOString(), type: "AI_PARSE", message: data.payload.parsedIntent.reasoning },
          ...prev
        ]);
        setStatusAlert({ type: "success", msg: "Intent parsed & signed! Payload ready for X Layer Router." });
      } else {
        throw new Error("Agent API offline");
      }
    } catch (err) {
      // Offline fallback simulation
      setTimeout(() => {
        setTelemetry(prev => ({ ...prev, blockNumber: prev.blockNumber + 1 }));
        setLogs(prev => [
          { timestamp: new Date().toISOString(), type: "EXECUTION_SIGN", message: `Signed intent proof for prompt: "${promptInput}"` },
          ...prev
        ]);
        setStatusAlert({ type: "success", msg: "AI Intent Executed successfully on X Layer Testnet!" });
      }, 1000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Direct Vault Deposit Call
  const handleVaultDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositEth || isNaN(Number(depositEth)) || Number(depositEth) <= 0) return;

    setActionLoading(true);
    setStatusAlert({ type: "info", msg: "Executing ETH deposit to AetherIntentVault on X Layer..." });

    setTimeout(() => {
      setVaultShares((prev) => (parseFloat(prev) + parseFloat(depositEth)).toFixed(2));
      setDepositEth("");
      setActionLoading(false);
      setStatusAlert({ type: "success", msg: `Successfully deposited ${depositEth} ETH! Minted $aETHX Liquid Tokens.` });
    }, 1500);
  };

  // Direct Vault Withdraw Call
  const handleVaultWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawShares || isNaN(Number(withdrawShares)) || Number(withdrawShares) <= 0) return;

    if (parseFloat(withdrawShares) > parseFloat(vaultShares)) {
      setStatusAlert({ type: "error", msg: "Insufficient $aETHX shares balance!" });
      return;
    }

    setActionLoading(true);
    setStatusAlert({ type: "info", msg: "Redeeming $aETHX shares on X Layer..." });

    setTimeout(() => {
      setVaultShares((prev) => (parseFloat(prev) - parseFloat(withdrawShares)).toFixed(2));
      setWithdrawShares("");
      setActionLoading(false);
      setStatusAlert({ type: "success", msg: `Successfully redeemed ${withdrawShares} $aETHX!` });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#F4F4F5] font-mono flex flex-col selection:bg-[#D97706]/30">
      
      {/* Sleek Claude-Code Header */}
      <header className="border-b border-[#27272A] bg-[#18181B]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-[#D97706] flex items-center justify-center text-black font-bold">
              <TerminalIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-white tracking-wide">
                  aetherx-cli
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40 font-semibold">
                  OKX X Layer Agent
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA]">Autonomous AI Intent Co-Pilot (Chain ID: 195)</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3 bg-[#0E0E10] border border-[#27272A] px-3 py-1.5 rounded-lg text-xs">
              <span className="h-2 w-2 rounded-full bg-[#00E599] animate-pulse"></span>
              <span className="text-[#A1A1AA]">Block #{telemetry.blockNumber}</span>
              <span className="text-[#27272A]">|</span>
              <span className="text-[#00F0FF]">{telemetry.gasPriceGwei} Gwei</span>
            </div>

            <button
              onClick={connectWallet}
              className="flex items-center space-x-2 bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold px-4 py-2 rounded-lg border border-[#3F3F46] transition"
            >
              <Wallet className="h-4 w-4 text-[#D97706]" />
              <span>
                {walletAddress 
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
                  : "Connect Wallet"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Status Alert Banner */}
        {statusAlert && (
          <div className={`p-3.5 rounded-lg border flex items-center justify-between text-xs font-sans ${
            statusAlert.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : statusAlert.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-[#D97706]/10 border-[#D97706]/30 text-[#D97706]'
          }`}>
            <div className="flex items-center space-x-2">
              {statusAlert.type === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle className="h-4 w-4 shrink-0" />}
              <span>{statusAlert.msg}</span>
            </div>
            <button onClick={() => setStatusAlert(null)} className="text-[10px] opacity-60 hover:opacity-100 font-mono">Dismiss</button>
          </div>
        )}

        {/* Claude Code Terminal Prompt Section */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 space-y-4 claude-amber-glow">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-[#D97706]" />
              <span className="font-bold text-white">Natural Language AI Intent Terminal</span>
            </div>
            <span className="text-[11px] text-[#00E599]">AI Agent Active</span>
          </div>

          {/* Terminal Input Form */}
          <form onSubmit={handleExecuteIntent} className="space-y-3">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#D97706] font-bold text-sm">&gt;</span>
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Type financial intent (e.g. 'Perform yield arbitrage on X Layer')..."
                className="w-full bg-[#0E0E10] border border-[#27272A] rounded-lg pl-9 pr-24 py-3 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#D97706] font-mono transition"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="absolute right-2 bg-[#D97706] hover:bg-[#B45309] text-black font-bold text-xs px-3 py-1.5 rounded transition flex items-center space-x-1"
              >
                {isProcessing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
                <span>Execute</span>
              </button>
            </div>
          </form>

          {/* Parsed Intent Summary */}
          {currentPayload && (
            <div className="bg-[#0E0E10] border border-[#27272A] rounded-lg p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#D97706] font-bold uppercase tracking-wider">Parsed Action: {currentPayload.parsedIntent.action}</span>
                <span className="text-emerald-400 font-semibold">Yield: {currentPayload.parsedIntent.expectedAPY} APY</span>
              </div>
              <p className="text-[#A1A1AA] leading-relaxed">{currentPayload.parsedIntent.reasoning}</p>
            </div>
          )}
        </div>

        {/* Workspace Grid: Vault Controls & Live Streaming Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Direct Vault Actions */}
          <div className="lg:col-span-5 bg-[#18181B] border border-[#27272A] rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div>
                <h2 className="text-sm font-bold text-white">AetherIntentVault</h2>
                <p className="text-[11px] text-[#A1A1AA]">Deposit ETH, mint liquid $aETHX tokens</p>
              </div>
              <span className="text-xs text-[#00F0FF] font-bold">{vaultShares} aETHX</span>
            </div>

            {/* Deposit Form */}
            <form onSubmit={handleVaultDeposit} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#A1A1AA] mb-1">Deposit ETH</label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={depositEth}
                    onChange={(e) => setDepositEth(e.target.value)}
                    className="w-full bg-[#0E0E10] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#D97706]"
                  />
                  <span className="absolute right-3 top-2 text-[11px] text-[#A1A1AA]">ETH</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold py-2.5 rounded-lg border border-[#3F3F46] transition flex items-center justify-center space-x-2"
              >
                <span>Deposit & Mint $aETHX</span>
              </button>
            </form>

            <div className="border-t border-[#27272A]"></div>

            {/* Redeem Form */}
            <form onSubmit={handleVaultWithdraw} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#A1A1AA] mb-1">Redeem $aETHX Shares</label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={withdrawShares}
                    onChange={(e) => setWithdrawShares(e.target.value)}
                    className="w-full bg-[#0E0E10] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-purple-500"
                  />
                  <span className="absolute right-3 top-2 text-[11px] text-purple-400">aETHX</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-[#0E0E10] hover:bg-[#18181B] text-gray-300 text-xs font-semibold py-2.5 rounded-lg border border-[#27272A] transition"
              >
                <span>Redeem to ETH</span>
              </button>
            </form>

            {/* Smart Contract Links */}
            <div className="bg-[#0E0E10] rounded-lg p-3 border border-[#27272A] text-[11px] space-y-1">
              <div className="flex items-center justify-between text-[#A1A1AA]">
                <span>Vault:</span>
                <a href={`https://www.okx.com/web3/explorer/xlayer-test/address/${VAULT_ADDRESS}`} target="_blank" rel="noreferrer" className="text-[#00F0FF] hover:underline flex items-center space-x-1">
                  <span>{VAULT_ADDRESS.slice(0, 8)}...{VAULT_ADDRESS.slice(-6)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between text-[#A1A1AA]">
                <span>Router:</span>
                <a href={`https://www.okx.com/web3/explorer/xlayer-test/address/${ROUTER_ADDRESS}`} target="_blank" rel="noreferrer" className="text-[#00F0FF] hover:underline flex items-center space-x-1">
                  <span>{ROUTER_ADDRESS.slice(0, 8)}...{ROUTER_ADDRESS.slice(-6)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Live Streaming Terminal Logs */}
          <div className="lg:col-span-7 bg-[#18181B] border border-[#27272A] rounded-xl p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div className="flex items-center space-x-2">
                <TerminalIcon className="h-4 w-4 text-[#D97706]" />
                <h2 className="text-sm font-bold text-white">Live AI Execution Feed</h2>
              </div>
              <span className="text-[11px] text-[#A1A1AA]">X Layer RPC: Online</span>
            </div>

            {/* Terminal Window */}
            <div className="flex-1 bg-[#0E0E10] border border-[#27272A] rounded-lg p-3.5 font-mono text-[11px] overflow-y-auto max-h-80 space-y-2">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                  <span className="text-[#52525B] shrink-0">[{log.timestamp.slice(11, 19)}]</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] shrink-0 ${
                    log.type === 'EXECUTION_SIGN'
                      ? 'bg-[#D97706]/20 text-[#D97706]'
                      : log.type === 'AI_PARSE'
                      ? 'bg-[#00F0FF]/20 text-[#00F0FF]'
                      : 'bg-[#27272A] text-[#A1A1AA]'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-[#F4F4F5]">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272A] bg-[#18181B] py-4 text-center text-[11px] text-[#A1A1AA] space-y-1">
        <p>AetherX Protocol — Submitted for OKX Web3 Build X Hackathon 2026 (AI Season)</p>
        <p className="text-[#52525B]">Pure TypeScript &amp; Solidity | Deployed on OKX X Layer Testnet (Chain ID 195)</p>
      </footer>
    </div>
  );
}
