// src/hooks/useIpfsGateway.js
import { IPFS_GATEWAY_BASE_URL } from '../constants'; // Import the constant here

const useIpfsGateway = () => {
  const getGatewayUrl = (ipfsPath) => {
    if (!ipfsPath) return ''; // Handle empty or null paths gracefully

    // If it's already an HTTP(S) URL, return as is
    if (ipfsPath.startsWith('http://') || ipfsPath.startsWith('https://')) {
      return ipfsPath;
    }
    
    // If it's an ipfs:// URL, strip the prefix
    let processedPath = ipfsPath;
    if (ipfsPath.startsWith('ipfs://')) {
      processedPath = ipfsPath.substring(7);
    }

    return `${IPFS_GATEWAY_BASE_URL}${processedPath}`;
  };

  return { getGatewayUrl, IPFS_GATEWAY_BASE_URL };
};

export default useIpfsGateway;