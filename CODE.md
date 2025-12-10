npm install @avalanche-sdk/interchain @avalanche-sdk/client

Setup
1. Create Wallet Client

import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
const account = privateKeyToAvalancheAccount("0x...");
const wallet = createAvalancheWalletClient({
  account,
  chain: avalancheFuji,
  transport: { type: "http" },
});
2. Initialize ICM Client

import { createICMClient } from "@avalanche-sdk/interchain";
import { avalancheFuji, dispatch } from "@avalanche-sdk/interchain/chains";
const icm = createICMClient(wallet, avalancheFuji, dispatch);
Send Your First Message

async function sendMessage() {
  const hash = await icm.sendMsg({
    sourceChain: avalancheFuji,
    destinationChain: dispatch,
    message: "Hello from Avalanche!",
  });
  console.log("Message sent:", hash);
}
Send Your First Token Transfer

import { createICTTClient } from "@avalanche-sdk/interchain";
const ictt = createICTTClient(avalancheFuji, dispatch);
// Deploy token and contracts (one-time setup)
const { contractAddress: tokenAddress } = await ictt.deployERC20Token({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  name: "My Token",
  symbol: "MTK",
  initialSupply: 1000000,
});
// Send tokens
const { txHash } = await ictt.sendToken({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  destinationChain: dispatch,
  tokenHomeContract: "0x...",
  tokenRemoteContract: "0x...",
  recipient: "0x...",
  amountInBaseUnit: 100,
});