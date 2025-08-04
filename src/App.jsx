// src/App.jsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuizContractReads } from "./hooks/useQuizContractReads";
import { Footer } from "./components/Footer";
import ConnectWalletSectionPlaceholder from "./components/ConnectWalletSectionPlaceholder";
import { REWARD_NFT_METADATA_URI } from "./constants";

// Import components directly
import QuizGame from "./components/QuizGame";
import ClaimSuccessDisplay from "./components/ClaimSuccessDisplay";

// Keep lazy loading for the ConnectWalletSection if desired to minimize initial bundle size
const LazyConnectWalletSection = lazy(() => import("./components/ConnectWalletSection"));


export default function App({ contractAddress }) {
  const { isConnected, isConnecting } = useAccount();

  const [nftMetadata, setNftMetadata] = useState(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  useEffect(() => {
    fetch(REWARD_NFT_METADATA_URI)
      .then(res => res.json())
      .then(meta => {
        setNftMetadata(meta);
        setIsLoadingMetadata(false);
      })
      .catch(err => {
        console.error("Failed to load NFT metadata", err);
        setIsLoadingMetadata(false);
      });
  }, []);

  const {
    hasUserClaimed,
    isLoadingHasClaimed,
    question,
    isLoadingAssignedQuestion,
    isErrorAssignedQuestion,
    assignedQuestionError,
    totalClaims,
    refetchTotalClaims,
    refetchHasClaimed,
  } = useQuizContractReads(contractAddress);

  const isInitialLoading = isConnecting || isLoadingHasClaimed || isLoadingAssignedQuestion || isLoadingMetadata;

  if (isInitialLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-cover bg-center" style={{ backgroundImage: "url('/images/jungle-temple.png')" }}>
        <div className="text-white text-xl font-display animate-pulse">Loading adventure...</div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-start p-8 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/jungle-temple.png')" }}
    >
      <div className="w-full max-w-screen-xl mx-auto mb-8">
        <img
          src="/images/quest-banner.webp"
          alt="Quest Banner"
          className="w-full h-auto object-cover object-center"
        />
      </div>

      <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-sandstone/90 backdrop-blur-sm rounded-xl shadow-soft p-8">
        <div className="bg-yellow-900 rounded-t-lg -mx-8 -mt-8 px-8 pt-6 pb-4 shadow-inner">
        <header className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-display text-white">Test of Knowledge</h1>
          <ConnectButton />
        </header>
        </div>

        <div className="mt-8">
          {!isConnected ? (
            <Suspense fallback={<ConnectWalletSectionPlaceholder />}>
              <LazyConnectWalletSection />
            </Suspense>
          ) : (
            <section className="space-y-6">
              {hasUserClaimed ? (
                <ClaimSuccessDisplay
                  totalClaims={totalClaims}
                  nftMetadata={nftMetadata}
                  showImage={true}
                />
              ) : (
                <QuizGame
                  contractAddress={contractAddress}
                  question={question}
                  isLoadingAssignedQuestion={isLoadingAssignedQuestion}
                  isErrorAssignedQuestion={isErrorAssignedQuestion}
                  assignedQuestionError={assignedQuestionError}
                  hasUserClaimed={hasUserClaimed}
                  isLoadingHasClaimed={isLoadingHasClaimed}
                  totalClaims={totalClaims}
                  refetchTotalClaims={refetchTotalClaims}
                  refetchHasClaimed={refetchHasClaimed}
                  nftMetadata={nftMetadata}
                />
              )}
            </section>
          )}
        </div>
      </div>
      <Footer contractAddress={contractAddress} />
    </main>
  );
}