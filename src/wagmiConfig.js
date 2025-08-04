// src/wagmiConfig.js
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";

const projectId = import.meta.env.VITE_PROJECT_ID;
const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY;

// 1. Create a new QueryClient instance with the desired default options.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // This is the crucial change
    },
  },
});

const appChains = [base];

export const { connectors } = getDefaultWallets({
  appName: "Quiz NFT",
  projectId,
  chains: appChains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  chains: appChains,
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`),
  },
});