import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectWalletSection = () => (
  <div className="text-center py-12 text-moss">
    {/* "Connect Wallet to Embark" heading */}
    <p className="text-4xl mb-6 font-display text-slate">
      Connect Wallet to Begin
    </p>

    {/* The preconnect.png image */}
    <div className="mb-6">
      <img
        src="/images/preconnect.png"
        alt="Pre-connect image"
        className="w-full h-auto rounded-lg shadow-md object-cover"
      />
    </div>

    {/* The "Only the wise one shall pass" sentence */}
    <p className="text-xl text-slate text-center mt-4 mb-6 font-display">
      Only wise ones shall pass
    </p>

    {/* The actual Connect Wallet button */}
    <div className="flex justify-center">
      <ConnectButton />
    </div>
  </div>
);

export default ConnectWalletSection;