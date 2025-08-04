import React, { useState, useEffect } from "react";
import { useContractWrite, useWaitForTransactionReceipt } from "wagmi";
import { ProgressBar } from "./ProgressBar";
import { ClaimSuccessDisplay } from "./ClaimSuccessDisplay";
import abi from "../abi/QuizClaim.json"; // Assuming this is the correct path to your ABI

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
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [displayStatus, setDisplayStatus] = useState("idle");
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [isWrongAnswerAttempt, setIsWrongAnswerAttempt] = useState(false);
  const [showOptimisticSuccess, setShowOptimisticSuccess] = useState(false);

  // 1. Use the useContractWrite hook to send the transaction.
  const {
    data: transactionData,
    writeContract,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
  } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "claim",
  });

  // 2. Use the useWaitForTransactionReceipt hook to monitor the transaction's status.
  const {
    isLoading: isConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: transactionData,
  });

  // 3. Unified effect to handle all transaction errors
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

  // 4. Effect to handle a successful transaction confirmation
  useEffect(() => {
    if (isTxConfirmed) {
      refetchTotalClaims();
    }
  }, [isTxConfirmed, refetchTotalClaims]);

  // 5. The function that triggers the optimistic UI and the transaction write
  const handleClaim = () => {
    // Only attempt to write if a valid answer is selected
    if (selectedAnswer) {
      setShowOptimisticSuccess(true);
      writeContract({
        args: [selectedAnswer],
      });
    }
  };

  // --- Render logic ---
  // The first check is for the optimistic success state.
  if (showOptimisticSuccess) {
    return <ClaimSuccessDisplay totalClaims={totalClaims} showImage={true} />;
  }

  // Then, we check for other states as before.
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
  
  // Final render for the quiz game itself
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
        onClick={handleClaim}
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