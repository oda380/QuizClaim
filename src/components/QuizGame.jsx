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
  const [displayStatus, setDisplayStatus] = useState("idle");
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [isWrongAnswerAttempt, setIsWrongAnswerAttempt] = useState(false);

  // CORRECTED: onSuccess callback now triggers a local state change and refetches data.
  const {
    handleClaimWrite,
    isLoadingTx,
    isConfirming,
    isSuccess,
    // Note: We are no longer using txStatus, as it seems to be the source of the issue.
  } = useQuizContractWrites(
    contractAddress,
    selectedAnswer,
    () => {
      // This is now just a placeholder; the main logic is moved to a useEffect hook.
    },
    (error) => {
      const rawErrorMessage = error?.shortMessage || error?.message || "An unknown error occurred.";
      if (rawErrorMessage.includes("Incorrect answer")) {
        setDisplayErrorMessage("You chose poorly");
        setIsWrongAnswerAttempt(true);
      } else {
        setDisplayErrorMessage(rawErrorMessage);
        setIsWrongAnswerAttempt(false);
      }
      setDisplayStatus("error");
    }
  );

  // New useEffect hook to handle a successful transaction.
  // This is a more reliable way to react to the `isSuccess` state.
  useEffect(() => {
    if (isSuccess) {
      setDisplayStatus("success");
      refetchTotalClaims();
      setIsWrongAnswerAttempt(false);
    }
  }, [isSuccess, refetchTotalClaims]);


  useEffect(() => {
    if (isErrorAssignedQuestion) {
      const reason = assignedQuestionError?.shortMessage || assignedQuestionError?.message || "The ancient scrolls are unreadable.";
      setDisplayErrorMessage(reason);
      setDisplayStatus("error");
      setIsWrongAnswerAttempt(false);
    } else if (!isLoadingAssignedQuestion && !question && !hasUserClaimed) {
      setDisplayErrorMessage("No quest assigned to your address.");
      setDisplayStatus("error");
      setIsWrongAnswerAttempt(false);
    }
  }, [isErrorAssignedQuestion, assignedQuestionError, isLoadingAssignedQuestion, question, hasUserClaimed]);


  // CORRECTED: Simplified button text logic
  const btnText = isLoadingTx
    ? "Confirm…"
    : isConfirming
    ? "Minting…"
    : isSuccess
    ? "Minted!"
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

  // CORRECTED: The `ClaimSuccessDisplay` is now returned when `isSuccess` is true
  if (isSuccess) {
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
        // CORRECTED: Simplified the disabled logic
        disabled={!selectedAnswer || isLoadingTx || isConfirming || isSuccess}
        className={`w-full py-4 mt-6 rounded-lg text-lg font-display transition-all duration-200 shadow-soft
          ${!selectedAnswer || isLoadingTx || isConfirming || isSuccess
            ? 'bg-slate/40 text-slate/60 cursor-not-allowed'
            : 'bg-canopy text-slate hover:bg-moss'}`}
      >
        {btnText}
        {(isLoadingTx || isConfirming) && (
          <span className="ml-2 inline-block animate-spin h-5 w-5 border-2 border-slate border-t-transparent rounded-full" />
        )}
      </button>
      <ProgressBar totalClaims={totalClaims} />
    </>
  );
};

export default QuizGame;