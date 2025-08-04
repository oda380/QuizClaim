import React from "react";
import { ProgressBar } from "./ProgressBar";
import { useIpfsGatewayContext } from '../context/IpfsGatewayContext';

export const ClaimSuccessDisplay = ({ totalClaims, showImage = true, nftMetadata }) => {
  const { getGatewayUrl } = useIpfsGatewayContext();
  
  const finalImageUrl = nftMetadata ? getGatewayUrl(nftMetadata.image) : "/images/placeholder.webp";

  return (
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