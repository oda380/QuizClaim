'use client';
import React, { createContext, useContext } from 'react';
import { IPFS_GATEWAY_BASE_URL } from '../constants';

// Create a React context with the default IPFS gateway URL
const IpfsGatewayContext = createContext(IPFS_GATEWAY_BASE_URL);

// Provider component to wrap application and supply context
export const IpfsGatewayProvider = ({ children }) => {
  const value = {
    gateway: IPFS_GATEWAY_BASE_URL,
    getGatewayUrl: (ipfsPath) => {
      if (!ipfsPath) return '';
      if (ipfsPath.startsWith('http://') || ipfsPath.startsWith('https://')) {
        return ipfsPath;
      }
      let processedPath = ipfsPath;
      if (ipfsPath.startsWith('ipfs://')) {
        processedPath = ipfsPath.substring(7);
      }
      return `${IPFS_GATEWAY_BASE_URL}${processedPath}`;
    }
  };

  return (
    <IpfsGatewayContext.Provider value={value}>
      {children}
    </IpfsGatewayContext.Provider>
  );
};

// Hook to consume the IPFS Gateway context
export const useIpfsGatewayContext = () => {
  const context = useContext(IpfsGatewayContext);
  if (context === undefined) {
    throw new Error('useIpfsGatewayContext must be used within an IpfsGatewayProvider');
  }
  return context;
};

// Make the provider the default export so React.lazy resolves correctly
export default IpfsGatewayProvider;
