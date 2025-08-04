import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import abi from "../abi/QuizClaim.json";

export const useQuizContractWrites = (contractAddress, selectedAnswer) => {
  const {
    data: txHash,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
    writeContract,
    reset,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleClaimWrite = () => {
    writeContract({
      address: contractAddress,
      abi,
      functionName: "claim",
      args: [selectedAnswer.trim().toLowerCase()],
    });
  };

  return {
    handleClaimWrite,
    isWritePending,
    isWriteError,
    writeError,
    isConfirming,
    isTxConfirmed,
    isTxError,
    txError,
    reset,
  };
};