// src/components/QuizGame.jsx
import React, { useState, useEffect } from "react";
import { useQuizContractWrites } from "../hooks/useQuizContractWrites";
import { ProgressBar } from "./ProgressBar";
import { ClaimSuccessDisplay } from "./ClaimSuccessDisplay";

export const QuizGame = ({
  contractAddress,
  question,
  isLoadingAssignedQuestion,
  isErrorAssignedQuestion,
  assignedQuestionError,
  hasUserClaimed,
  isLoadingHasClaimed,
  totalClaims,
  refetchTotalClaims,
  refetchHasClaimed, // New prop
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [displayStatus, setDisplayStatus] = useState("idle");
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [isWrongAnswerAttempt, setIsWrongAnswerAttempt] = useState(false);
  const [showOptimisticSuccess, setShowOptimisticSuccess] = useState(false);

  // Use the custom hook which now exposes granular wagmi state
  const {
    handleClaimWrite,
    isWritePending,
    isWriteError,
    writeError,
    isConfirming,
    isTxConfirmed,
    isTxError,
    txError,
    reset,
  } = useQuizContractWrites(contractAddress, selectedAnswer);

  // Unified effect to handle all transaction errors
  useEffect(() => {
    if (isTxError || isWriteError) {
      setShowOptimisticSuccess(false);
      const error = txError || writeError;
      const rawErrorMessage = error?.shortMessage || error?.message || "An unknown transaction error occurred.";
      if (rawErrorMessage.includes("Incorrect answer")) {
        setDisplayErrorMessage("You chose poorly");
        setIsWrongAnswerAttempt(true);
      } else {
        setDisplayErrorMessage(rawErrorMessage);
        setIsWrongAnswerAttempt(false);
      }
      setDisplayStatus("error");
    }
  }, [isTxError, isWriteError, txError, writeError]);

  // Effect to handle a successful transaction confirmation
  useEffect(() => {
    if (isTxConfirmed) {
      // The transaction was mined. Now we can refetch the on-chain data
      // to ensure consistency.
      refetchTotalClaims();
      refetchHasClaimed();
    }
  }, [isTxConfirmed, refetchTotalClaims, refetchHasClaimed]);

  // The function that triggers the optimistic UI and the transaction write
  const handleOptimisticClaim = () => {
    // Reset state before a new attempt
    reset(); 
    setDisplayErrorMessage("");
    setDisplayStatus("idle");

    if (selectedAnswer) {
      setShowOptimisticSuccess(true);
      handleClaimWrite();
    }
  };

  // --- Render logic ---
  // The first check is for the optimistic success state.
  if (showOptimisticSuccess) {
    return <ClaimSuccessDisplay totalClaims={totalClaims} showImage={true} />;
  }
  
  if (isLoadingHasClaimed) {
    return (
      <div className="p-5 bg-moss text-slate rounded-lg text-center font-medium">
        Verifying your past trials...
      </div>
    );
  }

  if (hasUserClaimed) {
    return <ClaimSuccessDisplay totalClaims={totalClaims} showImage={true} />;
  }

  if (isLoadingAssignedQuestion) {
    return (
      <div className="p-5 bg-moss text-slate rounded-lg text-center font-medium">
        Loading your trial...
      </div>
    );
  }

  if (displayStatus === "error") {
    return (
      <div className="p-5 bg-blossom text-slate rounded-lg text-center font-medium">
        <span className="text-2xl mr-2">
          {isWrongAnswerAttempt ? "❌" : "🚫"}
        </span>
        {displayErrorMessage}
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-5 bg-moss text-slate rounded-lg text-center">
        No trial assigned to your address.
      </div>
    );
  }
  
  const btnText = isWritePending
    ? "Confirming in Wallet…"
    : isConfirming
    ? "Minting…"
    : "Claim NFT";

  const isDisabled = !selectedAnswer || isWritePending || isConfirming;

  return (
    <>
      <p className="text-xl text-slate font-medium mb-4">{question.question}</p>
      <div className="grid gap-4">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelectedAnswer(opt)}
            className={`w-full py-3 rounded-lg font-medium transition transform duration-150
              ${selectedAnswer === opt
                ? 'bg-canopy text-ivory border border-canopy'
                : 'border border-moss bg-ivory text-slate hover:bg-moss hover:text-ivory'}`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        onClick={handleOptimisticClaim}
        disabled={isDisabled}
        className={`w-full py-4 mt-6 rounded-lg text-lg font-display transition-all duration-200 shadow-soft
          ${isDisabled
            ? 'bg-slate/40 text-slate/60 cursor-not-allowed'
            : 'bg-canopy text-slate hover:bg-moss'}`}
      >
        {btnText}
        {(isWritePending || isConfirming) && (
          <span className="ml-2 inline-block animate-spin h-5 w-5 border-2 border-slate border-t-transparent rounded-full" />
        )}
      </button>
      <ProgressBar totalClaims={totalClaims} />
    </>
  );
};

export default QuizGame;