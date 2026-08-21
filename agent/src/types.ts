export interface NetworkTelemetry {
  blockNumber: number;
  gasPriceGwei: string;
  networkName: string;
  rpcStatus: string;
}

export interface GateAuditResult {
  gate1_depth: "PASS" | "WARN" | "FAIL";
  gate2_contractSecurity: "PASS" | "WARN" | "FAIL";
  gate3_mevGuard: "PASS" | "WARN" | "FAIL";
  gate4_slippageBounds: "PASS" | "WARN" | "FAIL";
}

export interface ParsedIntent {
  action: "SWAP_AND_STAKE" | "DYNAMIC_REBALANCE" | "SAFETY_LOCK" | "YIELD_ARBITRAGE";
  tokenIn: string;
  tokenOut: string;
  amount: string;
  targetVaultId: number;
  expectedAPY: string;
  riskScore: number;
  verdict: "APPROVED" | "REVIEW_REQUIRED" | "BLOCKED";
  gateAudits: GateAuditResult;
  reasoning: string;
}

export interface IntentExecutionPayload {
  vaultAddress: string;
  routerAddress: string;
  firewallAddress: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  minAmountOut: string;
  targetVaultId: number;
  intentTag: string;
  network: string;
  blockNumber: number;
  inspectionHash: string;
  signatureProof: string;
  parsedIntent: ParsedIntent;
}

export interface LogEntry {
  timestamp: string;
  type: "SYSTEM" | "AI_PARSE" | "RPC_QUERY" | "FIREWALL_AUDIT" | "EXECUTION_SIGN";
  message: string;
}

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: any;
  }
}
