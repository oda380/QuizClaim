import React from "react";
import { TOTAL_AVAILABLE_TOKENS } from "../constants";

export const ProgressBar = ({ totalClaims }) => {
  const hasBrokenThrough = totalClaims > TOTAL_AVAILABLE_TOKENS;
  const textClasses = `mb-2 text-lg ${hasBrokenThrough ? 'font-bold text-sunlit' : 'text-slate'}`;
  const fillClasses = `h-6 rounded-full transition-all duration-500 ease-out ${
    hasBrokenThrough
      ? 'bg-sunlit shadow-lg transform hover:scale-105'
      : 'bg-canopy'
  }`;
  const progressPercentage = (totalClaims / TOTAL_AVAILABLE_TOKENS) * 100;

  return (
    <div className="mt-4 text-center">
      <p className={textClasses}>Passed the Trial: {totalClaims} / {TOTAL_AVAILABLE_TOKENS}</p>
      <div className="w-full bg-slate/30 rounded-full h-6 overflow-hidden">
        <div
          className={fillClasses}
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};