// src/App.jsx
import React, { Suspense, lazy } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuizContractReads } from "./hooks/useQuizContractReads";
import { Footer } from "./components/Footer";

// Lazily load components (they now each have a default export)
const LazyConnectWalletSection = lazy(() => import("./components/ConnectWalletSection"));
const LazyQuizGame            = lazy(() => import("./components/QuizGame"));
const LazyClaimSuccessDisplay = lazy(() => import("./components/ClaimSuccessDisplay"));

export default function App({ contractAddress }) {
  const { isConnected } = useAccount();

  const {
    hasUserClaimed,
    isLoadingHasClaimed,
    question,
    isLoadingAssignedQuestion,
    isErrorAssignedQuestion,
    assignedQuestionError,
    totalClaims,
    refetchTotalClaims,
  } = useQuizContractReads(contractAddress);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-start p-8 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/jungle-temple.png')" }}
    >
      {/* Banner */}
      {/* Banner */}
      <div className="w-full mb-8"> {/* Removed max-w-screen-xl and fixed height for better responsiveness */}
        <img
          src="/images/quest-banner.png"
          alt="Quest Banner"
          className="w-full h-auto object-cover object-center" // Use h-auto to maintain aspect ratio
        />
      </div>

      {/* Quiz Card */}
      <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-sandstone/90 backdrop-blur-sm rounded-xl shadow-soft p-8 animate-fade-in-up">
        <div className="bg-yellow-900 rounded-t-lg -mx-8 -mt-8 px-8 pt-6 pb-4 shadow-inner">
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-display text-white">Test of Knowledge</h1>
            <ConnectButton />
          </header>
        </div>

        <div className="mt-8">
          <Suspense fallback={<div>Loading content...</div>}>
            {!isConnected ? (
              <LazyConnectWalletSection />
            ) : (
              <section className="space-y-6">
                {hasUserClaimed ? (
                  <LazyClaimSuccessDisplay
                    totalClaims={totalClaims}
                    showImage={true}
                  />
                ) : (
                  <>
                    <div className="mb-6">
                      <img
                        src="/images/placeholder.png"
                        alt="Placeholder image for NFT"
                        className="w-full h-auto rounded-lg shadow-md object-cover"
                      />
                    </div>
                    <LazyQuizGame
                      contractAddress={contractAddress}
                      question={question}
                      isLoadingAssignedQuestion={isLoadingAssignedQuestion}
                      isErrorAssignedQuestion={isErrorAssignedQuestion}
                      assignedQuestionError={assignedQuestionError}
                      hasUserClaimed={hasUserClaimed}
                      isLoadingHasClaimed={isLoadingHasClaimed}
                      totalClaims={totalClaims}
                      refetchTotalClaims={refetchTotalClaims}
                    />
                  </>
                )}
              </section>
            )}
          </Suspense>
        </div>
      </div>

      <Footer contractAddress={contractAddress} />
    </main>
  );
}
