export interface NetworkTelemetry {
  blockNumber: number;
  gasPriceGwei: string;
  networkName: string;
  rpcStatus: string;
}

export interface ParsedIntent {
  action: "SWAP_AND_STAKE" | "DYNAMIC_REBALANCE" | "SAFETY_LOCK" | "YIELD_ARBITRAGE";
  tokenIn: string;
  tokenOut: string;
  amount: string;
  targetVaultId: number;
  expectedAPY: string;
  riskScore: number;
  reasoning: string;
}

export interface IntentExecutionPayload {
  vaultAddress: string;
  routerAddress: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  minAmountOut: string;
  targetVaultId: number;
  intentTag: string;
  network: string;
  blockNumber: number;
  signatureProof: string;
  parsedIntent: ParsedIntent;
}

export interface LogEntry {
  timestamp: string;
  type: "SYSTEM" | "AI_PARSE" | "RPC_QUERY" | "EXECUTION_SIGN";
  message: string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
