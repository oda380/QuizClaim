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
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [displayStatus, setDisplayStatus] = useState("idle"); // idle, error, success
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [isWrongAnswerAttempt, setIsWrongAnswerAttempt] = useState(false); // New state to track wrong answer

  const {
    handleClaimWrite,
    txStatus,
    // txErrorMessage, // No longer directly using this for display, but it's part of the error object
    isLoadingTx,
    isConfirming,
    isSuccess,
  } = useQuizContractWrites(
    contractAddress,
    selectedAnswer,
    () => {
      // onSuccess callback
      setDisplayStatus("success");
      refetchTotalClaims(); // Refetch total claims on successful transaction
      setIsWrongAnswerAttempt(false); // Reset this if successful
    },
    (error) => { // The 'error' object contains details about the transaction failure
      // Extract the relevant message from the error object
      const rawErrorMessage = error?.shortMessage || error?.message || "An unknown error occurred.";

      // Check if the error message indicates a wrong answer from your smart contract

      if (rawErrorMessage.includes("Incorrect answer")) {
        setDisplayErrorMessage("You chose poorly");
        setIsWrongAnswerAttempt(true);
      } else {
        // Handle other types of errors (e.g., gas estimation failed, user rejected, etc.)
        setDisplayErrorMessage(rawErrorMessage);
        setIsWrongAnswerAttempt(false);
      }
      setDisplayStatus("error");
    }
  );

  useEffect(() => {
    if (isErrorAssignedQuestion) {
      const reason = assignedQuestionError?.shortMessage || assignedQuestionError?.message || "The ancient scrolls are unreadable.";
      setDisplayErrorMessage(reason);
      setDisplayStatus("error");
      setIsWrongAnswerAttempt(false); // Not a wrong answer attempt, but an initial error
    } else if (!isLoadingAssignedQuestion && !question && !hasUserClaimed) {
      setDisplayErrorMessage("No quest assigned to your address.");
      setDisplayStatus("error");
      setIsWrongAnswerAttempt(false);
    }
  }, [isErrorAssignedQuestion, assignedQuestionError, isLoadingAssignedQuestion, question, hasUserClaimed]);


  const btnText = isLoadingTx
    ? "Confirm…"
    : isConfirming
    ? "Minting…"
    : txStatus === "submitting"
    ? "Sending…"
    : "Claim NFT";

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

  // Display the specific error message based on `isWrongAnswerAttempt`
  if (displayStatus === "error") {
    return (
      <div className="p-5 bg-blossom text-slate rounded-lg text-center font-medium">
        {/* You can use a different emoji for a wrong answer if you like! */}
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

  // If a transaction was successful but the user hasn't claimed yet (e.g. initial claim)
  if (isSuccess && displayStatus === "success") {
    return <ClaimSuccessDisplay totalClaims={totalClaims} showImage={true} />;
  }


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
        onClick={handleClaimWrite}
        disabled={!selectedAnswer || isLoadingTx || isConfirming || txStatus === "submitting"}
        className={`w-full py-4 mt-6 rounded-lg text-lg font-display transition-all duration-200 shadow-soft
          ${!selectedAnswer || isLoadingTx || isConfirming || txStatus === "submitting"
            ? 'bg-slate/40 text-slate/60 cursor-not-allowed'
            : 'bg-canopy text-slate hover:bg-moss'}`}
      >
        {btnText}
        {(isLoadingTx || isConfirming || txStatus === "submitting") && (
          <span className="ml-2 inline-block animate-spin h-5 w-5 border-2 border-slate border-t-transparent rounded-full" />
        )}
      </button>
      <ProgressBar totalClaims={totalClaims} />
    </>
  );
};

export default QuizGame;