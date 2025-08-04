import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import abi from "../abi/QuizClaim.json";
import { useState, useEffect } from "react";

export const useQuizContractWrites = (contractAddress, selectedAnswer, onClaimSuccess, onClaimError) => {
  const [txStatus, setTxStatus] = useState("idle");
  const [txErrorMessage, setTxErrorMessage] = useState("");

  // --- CHANGE #1: Initialize useWriteContract with NO arguments ---
  const {
    data: txData,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
    writeContract,
    reset // It's good practice to get the reset function to clear errors
  } = useWriteContract();

  const handleClaimWrite = () => {
    // Reset previous errors before a new attempt
    setTxErrorMessage("");
    reset(); 
    setTxStatus("submitting");

    if (typeof writeContract !== 'function') {
      const errorMessage = "Transaction cannot be initiated. Ensure wallet is connected.";
      console.error("ERROR: 'writeContract' is not a function.");
      setTxErrorMessage(errorMessage);
      setTxStatus("error");
      onClaimError(new Error(errorMessage));
      return;
    }

    // --- CHANGE #2: Pass the configuration object HERE ---
    writeContract({
      address: contractAddress,
      abi,
      functionName: "claim",
      args: [selectedAnswer.trim().toLowerCase()],
    });
  };

  // This effect handles the outcome of the writeContract call
  useEffect(() => {
    if (isWriteError && writeError) {
      const reason = writeError?.shortMessage || writeError?.message || "Transaction failed.";
      console.error("Error from useWriteContract:", writeError);
      setTxErrorMessage(reason);
      setTxStatus("error");
      onClaimError(writeError);
    }
  }, [isWriteError, writeError, onClaimError]);


  // This hook waits for the transaction to be confirmed
  const {
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash: txData?.hash,
    onSuccess: (receipt) => {
      setTxStatus("success");
      onClaimSuccess(receipt);
    },
    onError: (error) => {
      const reason = error?.shortMessage || error?.message || "Transaction confirmation failed.";
      console.error("Transaction confirmation error:", error);
      setTxErrorMessage(reason);
      setTxStatus("error");
      onClaimError(error);
    },
  });

  const isLoadingTx = isWritePending || isConfirming;

  return {
    handleClaimWrite,
    txStatus,
    txErrorMessage,
    isLoadingTx,
    isConfirming,
    isSuccess,
  };
};