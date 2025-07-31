import React from 'react';

export const ConnectWalletSectionPlaceholder = () => (
  <div className="text-center py-12 text-moss animate-pulse">
    {/* Placeholder for "Connect Wallet to Begin" heading */}
    <div className="h-10 w-3/4 mx-auto mb-6 bg-gray-300 rounded-lg"></div>

    {/* Placeholder for the image */}
    <div className="mb-6">
      <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96 bg-gray-400 rounded-lg shadow-md object-cover"></div>
    </div>

    {/* Placeholder for "Only the wise one shall pass" sentence */}
    <div className="h-6 w-1/2 mx-auto mt-4 mb-6 bg-gray-300 rounded-lg"></div>

    {/* Placeholder for the Connect Wallet button */}
    <div className="flex justify-center">
      <div className="h-10 w-48 bg-gray-400 rounded-full"></div>
    </div>
  </div>
);

export default ConnectWalletSectionPlaceholder;