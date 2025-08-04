// src/hooks/useQuizContractReads.js
import { useAccount, useContractRead } from "wagmi";
import abi from "../abi/QuizClaim.json";
import QUESTIONS from "../questions.json";

export const useQuizContractReads = (contractAddress) => {
  const { address, isConnected } = useAccount();

  // Read hasClaimed status for the connected address.
  // We'll remove 'watch: true' and rely on manual refetching.
  const {
    data: hasUserClaimed,
    isLoading: isLoadingHasClaimed,
    refetch: refetchHasClaimed,
  } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "hasClaimed",
    args: [address],
    enabled: isConnected && !!address,
  });

  // Fetch assigned question (only if user hasn't claimed yet)
  const {
    data: assignedQuestionIndexRaw,
    isLoading: isLoadingAssignedQuestion,
    isError: isErrorAssignedQuestion,
    error: assignedQuestionError,
  } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getAssignedQuestion",
    args: [address],
    enabled: isConnected && !!address && hasUserClaimed === false,
  });

  // Read totalClaims from the contract
  // We'll also remove 'watch: true' here and rely on manual refetching.
  const {
    data: totalClaimsData,
    refetch: refetchTotalClaims,
  } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "totalClaims",
  });

  const totalClaims = totalClaimsData ? Number(totalClaimsData) : 0;

  // Determine the actual question object
  const assignedQuestionIndex = assignedQuestionIndexRaw !== undefined && assignedQuestionIndexRaw !== null
    ? Number(assignedQuestionIndexRaw)
    : null;

  const question = assignedQuestionIndex !== null && assignedQuestionIndex >= 0 && assignedQuestionIndex < QUESTIONS.length
    ? QUESTIONS[assignedQuestionIndex]
    : null;

  return {
    hasUserClaimed,
    isLoadingHasClaimed,
    assignedQuestionIndex,
    question,
    isLoadingAssignedQuestion,
    isErrorAssignedQuestion,
    assignedQuestionError,
    totalClaims,
    refetchTotalClaims,
    // Add the refetch for hasUserClaimed so we can trigger it after a successful claim.
    refetchHasClaimed,
  };
};