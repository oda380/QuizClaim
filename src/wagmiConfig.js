// src/wagmiConfig.js
import { createConfig, http } from "wagmi"; // Import http directly from 'wagmi'
import { base } from "wagmi/chains"; // Import the base chain
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";

// Environment variables
const projectId = import.meta.env.VITE_PROJECT_ID; // This is for WalletConnect
const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY; // <--- Get Alchemy API key

// Create a new QueryClient instance for React Query
export const queryClient = new QueryClient();

// 1. Define the chains your application will support.
const appChains = [base]; // Only Base mainnet

// 2. Get the connectors from RainbowKit, using the defined chains.
export const { connectors } = getDefaultWallets({
  appName: "Quiz NFT", // Your application name
  projectId, // Your WalletConnect Project ID
  chains: appChains,
});

// 3. Create the Wagmi config.
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  chains: appChains,
  transports: {
    // Construct the Alchemy RPC URL directly using the API key
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`), // <--- MODIFIED HERE
  },
});