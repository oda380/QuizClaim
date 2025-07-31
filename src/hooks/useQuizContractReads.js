import { useAccount, useContractRead } from "wagmi";
import abi from "../abi/QuizClaim.json";
import QUESTIONS from "../questions.json";

export const useQuizContractReads = (contractAddress) => {
  const { address, isConnected } = useAccount();

  // Read hasClaimed status for the connected address
  const { data: hasUserClaimed, isLoading: isLoadingHasClaimed } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "hasClaimed",
    args: [address],
    enabled: isConnected && !!address,
    watch: true,
  });

  // Fetch assigned question (only if user hasn't claimed yet)
  const {
    data: assignedQuestionIndexRaw,
    isLoading: isLoadingAssignedQuestion,
    isError: isErrorAssignedQuestion,
    error: assignedQuestionError
  } = useContractRead({
      address: contractAddress,
      abi,
      functionName: "getAssignedQuestion",
      args: [address],
      enabled: isConnected && !!address && hasUserClaimed === false,
    });

  const assignedQuestionIndex = assignedQuestionIndexRaw !== undefined && assignedQuestionIndexRaw !== null
    ? (typeof assignedQuestionIndexRaw?.toNumber === 'function'
      ? assignedQuestionIndexRaw.toNumber()
      : Number(assignedQuestionIndexRaw))
    : null;

  // Read totalClaims from the contract
  const { data: totalClaimsData, refetch: refetchTotalClaims } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "totalClaims",
    watch: true,
  });

  const totalClaims = totalClaimsData ? Number(totalClaimsData) : 0;

  // Determine the actual question object
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
  };
};