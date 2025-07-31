import React from 'react';

export const ClaimSuccessDisplayPlaceholder = () => (
  <div className="text-center py-12 space-y-6 animate-pulse">
    {/* Placeholder for "Claim Successful!" heading */}
    <div className="h-12 w-3/4 mx-auto bg-green-500 rounded-lg"></div>

    {/* Placeholder for the total claims count */}
    <div className="h-6 w-1/4 mx-auto bg-gray-300 rounded-lg"></div>
  </div>
);

export default ClaimSuccessDisplayPlaceholder;