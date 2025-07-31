// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Keep this import
import "@rainbow-me/rainbowkit/styles.css";
import { IpfsGatewayProvider } from './context/IpfsGatewayContext.jsx';

import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";

import { WagmiConfig } from "wagmi";
import { wagmiConfig, queryClient } from "./wagmiConfig";
import { QueryClientProvider } from "@tanstack/react-query";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const myTheme = {
  ...lightTheme({
    overlayBlur: 'small',
  }),
  colors: {
    ...lightTheme().colors,
    accentColor: '#525252',           // Neutral-700 (dark grey rock)
    accentColorForeground: '#FFFFFF', // Pure white text 
    modalBackground: '#F5EFE6',       // sandstone background
  },
  fonts: {
    body: 'inherit',
  },
  radii: {
    actionButton: '12px',
    connectButton: '24px', 
    menuButton: '12px',
    modal: '16px',
  },
  
};

ReactDOM.createRoot(document.getElementById("root")).render(

    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={myTheme}>
          <IpfsGatewayProvider>
          <App contractAddress={contractAddress} />
          </IpfsGatewayProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>

);