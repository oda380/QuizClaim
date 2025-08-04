import React, { useState, useEffect } from "react";
import { useQuizContractWrites } from "../hooks/useQuizContractWrites";
import { ProgressBar } from "./ProgressBar";
import { ClaimSuccessDisplay } from "./ClaimSuccessDisplay";
import { useIpfsGatewayContext } from '../context/IpfsGatewayContext';

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
  refetchHasClaimed,
  nftMetadata,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [displayStatus, setDisplayStatus] = useState("idle");
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [isWrongAnswerAttempt, setIsWrongAnswerAttempt] = useState(false);
  const { getGatewayUrl } = useIpfsGatewayContext();

  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);

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

  useEffect(() => {
    if (isTxError || isWriteError) {
      setIsCheckingAnswer(false);
      reset();
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
    if (isTxConfirmed) {
      setIsCheckingAnswer(false);
      refetchTotalClaims();
      refetchHasClaimed();
    }
  }, [isTxError, isWriteError, txError, writeError, isTxConfirmed, reset, refetchTotalClaims, refetchHasClaimed]);


  const handleClaim = () => {
    setIsCheckingAnswer(true);
    setDisplayErrorMessage("");
    setDisplayStatus("idle");
    if (selectedAnswer) {
      handleClaimWrite();
    }
  };

  const btnText = isWritePending
    ? "Confirming in Wallet…"
    : isConfirming
    ? "Checking..."
    : "Claim NFT";

  const isDisabled = !selectedAnswer || isWritePending || isConfirming || isCheckingAnswer;

  let loadingMessage = "Checking your answer...";
  if (isWritePending) {
    loadingMessage = "Please open your wallet and sign the transaction...";
  } else if (isConfirming) {
    loadingMessage = "Verifying your transaction...";
  }

  if (isLoadingHasClaimed) {
    return (
      <div className="p-5 bg-moss text-slate rounded-lg text-center font-medium">
        Verifying your past trials...
      </div>
    );
  }

  if (hasUserClaimed) {
    return <ClaimSuccessDisplay totalClaims={totalClaims} nftMetadata={nftMetadata} showImage={true} />;
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
  
  const imageUrl = "/images/placeholder.webp";

  return (
    // This is the new parent container with relative positioning
    <div className="relative"> 
      {/* This is the regular quiz content */}
      <div className="mb-6">
        <img
          src={imageUrl}
          alt="Placeholder image for NFT"
          className="w-full h-auto rounded-lg shadow-md object-cover"
        />
      </div>
      <p className="text-xl text-slate font-medium mb-4">{question.question}</p>
      <div className="grid gap-4">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelectedAnswer(opt)}
            disabled={isCheckingAnswer || isWritePending || isConfirming}
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
      </button>
      <ProgressBar totalClaims={totalClaims} />

      {/* --- This is the new conditional overlay --- */}
      {(isCheckingAnswer || isWritePending || isConfirming) && (
        <div className="absolute inset-0 bg-sandstone/70 backdrop-blur-sm rounded-xl flex items-center justify-center p-4 text-center text-slate animate-fade-in">
          <div className="text-xl font-medium flex items-center">
            <span className="ml-2 inline-block animate-spin h-5 w-5 border-2 border-slate border-t-transparent rounded-full mr-2" />
            {loadingMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGame;