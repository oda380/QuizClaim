// constants/index.js

// Accessing the environment variable
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

// Export the base URL directly
export const IPFS_GATEWAY_BASE_URL = import.meta.env.VITE_REWARD_NFT_METADATA_BASE_URL || "https://ipfs.io/ipfs/";

export const TOTAL_AVAILABLE_TOKENS = 200; 

// Example usage where you construct the full URL
export const ALCHEMY_RPC_URL = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
export const REWARD_NFT_METADATA_URI = `${IPFS_GATEWAY_BASE_URL}bafybeiewp7vnlphh7kzqnztzl6mun45vpf4zdwayjkvkdxginuq7wpsw2m/reward.json`;