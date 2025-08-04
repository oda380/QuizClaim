// App.jsx
import React, { Suspense, lazy } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuizContractReads } from "./hooks/useQuizContractReads";
import { Footer } from "./components/Footer";
import ConnectWalletSectionPlaceholder from "./components/ConnectWalletSectionPlaceholder";
import ClaimSuccessDisplayPlaceholder from "./components/ClaimSuccessDisplayPlaceholder";

// Import components directly instead of lazy-loading them
import QuizGame from "./components/QuizGame";
// Keep LazyConnectWalletSection if you still want to lazy-load the wallet section
const LazyConnectWalletSection = lazy(() => import("./components/ConnectWalletSection"));
const LazyClaimSuccessDisplay = lazy(() => import("./components/ClaimSuccessDisplay"));


export default function App({ contractAddress }) {
  const { isConnected, isConnecting } = useAccount();

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

  const isInitialLoading = isConnecting || isLoadingHasClaimed || isLoadingAssignedQuestion;

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
      {/* Banner */}
      <div className="w-full max-w-screen-xl mx-auto mb-8">
        <img
          src="/images/quest-banner.webp"
          alt="Quest Banner"
          className="w-full h-auto object-cover object-center"
        />
      </div>

      {/* Quiz Card */}
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
                <Suspense fallback={<ClaimSuccessDisplayPlaceholder />}>
                  <LazyClaimSuccessDisplay
                    totalClaims={totalClaims}
                    showImage={true}
                  />
                </Suspense>
              ) : (
                <>
                  <div className="mb-6">
                    <img
                      src="/images/placeholder.webp"
                      alt="Placeholder image for NFT"
                      className="w-full h-auto rounded-lg shadow-md object-cover"
                    />
                  </div>
                  {/* Now QuizGame is rendered directly, no Suspense needed */}
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
                  />
                </>
              )}
            </section>
          )}
        </div>
      </div>

      <Footer contractAddress={contractAddress} />
    </main>
  );
}