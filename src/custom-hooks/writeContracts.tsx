import { useWriteContract } from "wagmi";
import { stableSwapContract } from "../contracts/contracts";

export const useWriteContractSwap = () => {
  const { writeContract } = useWriteContract();

  const swap = (
    fromIndex: number,
    toIndex: number,
    inputBigInt: bigint,
    minDy: bigint
  ) => {
    return writeContract({
      address: stableSwapContract.address,
      abi: stableSwapContract.abi,
      functionName: "swap",
      args: [fromIndex, toIndex, inputBigInt, minDy],
    });
  };
  return { swap };
};
