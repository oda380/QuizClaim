// ClaimSuccessDisplay.jsx (updated to use Context)
import React, { useEffect, useState } from "react";
import { REWARD_NFT_METADATA_URI } from "../constants";
import { ProgressBar } from "./ProgressBar";
import { useIpfsGatewayContext } from '../context/IpfsGatewayContext'; // Import context hook

export const ClaimSuccessDisplay = ({ totalClaims, showImage = true }) => {
  const [nftMetadata, setNftMetadata] = useState(null);
  const [ipfsImageCid, setIpfsImageCid] = useState(null);
  const { getGatewayUrl } = useIpfsGatewayContext(); // Use the context hook

  useEffect(() => {
    fetch(REWARD_NFT_METADATA_URI)
      .then(res => res.json())
      .then(meta => {
        setNftMetadata(meta);
        setIpfsImageCid(meta.image);
      })
      .catch(err => console.error("Failed to load NFT metadata", err));
  }, []);

  const finalImageUrl = ipfsImageCid ? getGatewayUrl(ipfsImageCid) : "/images/placeholder.png";

  return (
    // ... rest of your component remains the same
    <div className="mt-6 p-5 bg-sunlit text-slate rounded-lg text-center font-medium animate-fade-in">
      ✨ You have chosen wisely!
      {showImage && (
        <div className="mb-6">
          <img
            src={finalImageUrl}
            alt={nftMetadata ? nftMetadata.name : "Your claimed NFT"}
            className="w-full h-auto rounded-lg shadow-md object-cover mt-4"
          />
        </div>
      )}
      {nftMetadata && (
        <div className="mt-4 text-center text-slate">
          <h3 className="text-xl font-display mb-2 text-canopy">{nftMetadata.name}</h3>
          <p className="text-sm mb-3">{nftMetadata.description}</p>
          {nftMetadata.attributes && nftMetadata.attributes.length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {nftMetadata.attributes.map((attr, index) => (
                <div key={index} className="bg-canopy/20 rounded-md p-2">
                  <p className="font-bold">{attr.trait_type}:</p>
                  <p>{attr.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <ProgressBar totalClaims={totalClaims} />
    </div>
  );
};

export default ClaimSuccessDisplay;