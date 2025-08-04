// src/App.jsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuizContractReads } from "./hooks/useQuizContractReads";
import { Footer } from "./components/Footer";
import ConnectWalletSectionPlaceholder from "./components/ConnectWalletSectionPlaceholder";
import { REWARD_NFT_METADATA_URI } from "./constants";
import QUESTIONS from "./questions.json";

import QuizGame from "./components/QuizGame";
import ClaimSuccessDisplay from "./components/ClaimSuccessDisplay";

const LazyConnectWalletSection = lazy(() => import("./components/ConnectWalletSection"));

export default function App({ contractAddress }) {
  const { isConnected, isConnecting } = useAccount();

  const [nftMetadata, setNftMetadata] = useState(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [isTxConfirmed, setIsTxConfirmed] = useState(false);

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
    questionIndex, // <-- Get the index from the hook
    isLoadingQuestionIndex, // <-- NEW
    isErrorQuestionIndex,   // <-- NEW
    questionIndexError,     // <-- NEW
    totalClaims,
    refetchTotalClaims,
    refetchHasClaimed,
  } = useQuizContractReads(contractAddress);

  // Map the fetched question index to the full question object
  const question = questionIndex !== undefined ? QUESTIONS[Number(questionIndex)] : undefined;
  
  // --- DEBUGGING ---
  console.log("questionIndex from contract:", questionIndex);
  console.log("question object from JSON:", question);
  console.log("isLoadingQuestionIndex:", isLoadingQuestionIndex);
  console.log("isErrorQuestionIndex:", isErrorQuestionIndex);
  // --- DEBUGGING ---

  const isInitialLoading = isConnecting || isLoadingMetadata || isLoadingQuestionIndex;

  if (isInitialLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-cover bg-center" style={{ backgroundImage: "url('/images/jungle-temple.png')" }}>
        <div className="text-white text-xl font-display animate-pulse">Loading adventure...</div>
      </main>
    );
  }
  
  // Handle a contract read error here
  if (isErrorQuestionIndex) {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-cover bg-center" style={{ backgroundImage: "url('/images/jungle-temple.png')" }}>
            <div className="text-white text-xl font-display text-center p-8 bg-red-800/90 rounded-xl shadow-soft">
                Error fetching question from contract: {questionIndexError?.shortMessage || "An unknown error occurred."}
            </div>
        </main>
    );
  }

  if (hasUserClaimed && !isLoadingHasClaimed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-start p-8 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/jungle-temple.png')" }}>
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
            <ClaimSuccessDisplay
              totalClaims={totalClaims}
              nftMetadata={nftMetadata}
              showImage={true}
            />
          </div>
        </div>
        <Footer contractAddress={contractAddress} />
      </main>
    );
  }

  if (isTxConfirmed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-cover bg-center" style={{ backgroundImage: "url('/images/jungle-temple.png')" }}>
        <div className="text-white text-xl font-display animate-pulse flex items-center p-8 bg-sandstone/90 rounded-xl shadow-soft">
          <span className="ml-2 inline-block animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
          Transaction confirmed. Preparing your reward...
        </div>
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
              <QuizGame
                contractAddress={contractAddress}
                question={question}
                isLoadingAssignedQuestion={isLoadingQuestionIndex}
                hasUserClaimed={hasUserClaimed}
                isLoadingHasClaimed={isLoadingHasClaimed}
                totalClaims={totalClaims}
                refetchTotalClaims={refetchTotalClaims}
                refetchHasClaimed={refetchHasClaimed}
                nftMetadata={nftMetadata}
                setIsTxConfirmed={setIsTxConfirmed}
              />
            </section>
          )}
        </div>
      </div>
      <Footer contractAddress={contractAddress} />
    </main>
  );
}