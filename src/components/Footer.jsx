import React from "react";

export const Footer = ({ contractAddress }) => (
  <footer className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto text-center py-4 mt-8 bg-sandstone/70 backdrop-blur-sm text-slate text-sm rounded-lg shadow-inner">
    <p>&copy; {new Date().getFullYear()} Crypto Quests. All rights reserved.</p>
    <p className="mt-1 flex items-center justify-center">
      Powered by{" "}
      <a
        href="https://base.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 text-slate hover:text-sunlit transition-colors duration-200"
        aria-label="Powered by Base"
      >
        <svg
          className="w-5 h-5 inline-block align-middle"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 1.5c5.799 0 10.5 4.701 10.5 10.5S17.799 22.5 12 22.5 1.5 17.799 1.5 12 6.201 1.5 12 1.5zm0 2.5c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 1.5c3.59 0 6.5 2.91 6.5 6.5S15.59 18.5 12 18.5 5.5 15.59 5.5 12 8.41 5.5 12 5.5zm0 1.5c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0 1.5c1.93 0 3.5 1.57 3.5 3.5S13.93 15.5 12 15.5 8.5 13.93 8.5 12 10.07 8.5 12 8.5zm0 1.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z"/>
        </svg>
        Base
      </a>
    </p>
    {contractAddress && (
      <p className="mt-1">
        Contract Address:{" "}
        <a
          href={`https://basescan.org/address/${contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate font-bold hover:underline"
        >
          {contractAddress.substring(0, 6)}...{contractAddress.substring(contractAddress.length - 4)}
        </a>
      </p>
    )}
    <p className="mt-1">
      Built by:{" "}
      <a
        href="https://basescan.org/name/ktlimdev.base.eth"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate font-bold hover:underline"
      >
        ktlimdev.base.eth
      </a>
    </p>
    <div className="flex justify-center gap-4 mt-2">
      <a
        href="https://t.me/kitaeklim380"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate hover:text-sunlit transition-colors duration-200"
        aria-label="Telegram"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.364 5.636c-.927-.927-2.18-.927-3.108 0l-7.39 7.39c-.927.927-.927 2.18 0 3.108.927.927 2.18.927 3.108 0l4.243-4.243a.75.75 0 00-1.06-1.06l-3.182 3.182a.75.75 0 01-1.06-1.06l4.243-4.243c.37-.37.86-.574 1.38-.574.52 0 1.01.204 1.38.574.757.757.757 1.984 0 2.741l-7.39 7.39c-1.667 1.667-4.373 1.667-6.04 0-1.667-1.667-1.667-4.373 0-6.04l7.39-7.39c2.494-2.494 6.536-2.494 9.03 0 2.494 2.494 2.494 6.536 0 9.03l-4.243 4.243a.75.75 0 001.06 1.06l4.243-4.243c.927-.927.927-2.18 0-3.108-.927-.927-2.18-.927-3.108 0l-7.39 7.39c-1.667 1.667-4.373 1.667-6.04 0-1.667-1.667-1.667-4.373 0-6.04l7.39-7.39c2.494-2.494 6.536-2.494 9.03 0 2.494 2.494 2.494 6.536 0 9.03l-4.243 4.243a.75.75 0 001.06 1.06z"/>
        </svg>
      </a>
      <a
        href="https://x.com/ktlim380"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate hover:text-sunlit transition-colors duration-200"
        aria-label="X (Twitter)"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.21-6.887L6.413 21.75H2.892l7.57-8.64L1.5 2.25H8.007l4.327 5.688L18.244 2.25zm-2.91 17.295h1.46L6.413 4.117H4.856l10.478 15.433z"/>
        </svg>
      </a>
    </div>
  </footer>
);