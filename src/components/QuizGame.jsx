import React, { useState, useEffect } from "react";
import { useContractWrite, useWaitForTransactionReceipt } from "wagmi";
import { ProgressBar } from "./ProgressBar";
import { ClaimSuccessDisplay } from "./ClaimSuccessDisplay";
import abi from "../abi/QuizClaim.json"; // Assuming abi is now imported directly here

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
    write,
    data: transactionData,
    isLoading: isWriteLoading,
    isError: isWriteError,
    error: writeError,
  } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "claim",
    args: [selectedAnswer],
  });

  // 2. Use the useWaitForTransactionReceipt hook to monitor the transaction's status on the chain.
  const {
    isLoading: isConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: transactionData?.hash,
  });

  // 3. Effect to handle transaction failures
  useEffect(() => {
    if (isTxError || isWriteError) {
      // Transaction failed on-chain or failed to be sent.
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
      // The transaction was mined and confirmed. Now we can be sure
      // the on-chain state is updated. Refetch the data to get accurate counts.
      refetchTotalClaims();
      // At this point, hasUserClaimed will be true on the next read cycle.
    }
  }, [isTxConfirmed, refetchTotalClaims]);

  // 5. Unified handler for the claim action
  const handleClaim = () => {
    // Optimistically show the success screen as soon as the user triggers the write action
    setShowOptimisticSuccess(true);
    // Execute the write function from wagmi
    write();
  };

  // --- Render logic ---
  // The first checks are for the initial data loading states
  if (isLoadingHasClaimed) {
    return (
      <div className="p-5 bg-moss text-slate rounded-lg text-center font-medium">
        Verifying your past trials...
      </div>
    );
  }

  // Check if the user has already claimed the token.
  if (hasUserClaimed) {
    return <ClaimSuccessDisplay totalClaims={totalClaims} showImage={true} />;
  }
  
  // Check if we are optimistically showing the success state.
  // This will be true immediately after the user sends the transaction.
  if (showOptimisticSuccess) {
    return <ClaimSuccessDisplay totalClaims={totalClaims} showImage={true} />;
  }

  // The rest of the initial loading and error states for the quiz itself.
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
  );

  if (!question) {
    return (
      <div className="p-5 bg-moss text-slate rounded-lg text-center">
        No trial assigned to your address.
      </div>
    );
  }
  
  // Final render for the quiz game itself
  const btnText = isWriteLoading
    ? "Confirming in Wallet…"
    : isConfirming
    ? "Minting…"
    : "Claim NFT";

  const isDisabled = !selectedAnswer || isWriteLoading || isConfirming;

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
        {(isWriteLoading || isConfirming) && (
          <span className="ml-2 inline-block animate-spin h-5 w-5 border-2 border-slate border-t-transparent rounded-full" />
        )}
      </button>
      <ProgressBar totalClaims={totalClaims} />
    </>
  );
};

export default QuizGame;