import { useReadContracts } from "wagmi";
import {
  IDRXContract,
  USDCContract,
  EURCContract,
} from "../contracts/contracts";
import { formatEther } from "viem";
import { formatEUR, formatIDR, formatUSD } from "@/util/helper";

export const useFetchBalances = (userAddress: string) => {
  const { data, error, isLoading } = useReadContracts({
    contracts: [
      {
        ...IDRXContract,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        ...USDCContract,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        ...EURCContract,
        functionName: "balanceOf",
        args: [userAddress],
      },
    ],
  });

  // Map the data to a more usable format
  const balances = data
    ? data.map((balance) => ({
        status: balance.status,
        result: balance.result,
        error: balance.error,
      }))
    : [];

  return {
    balances,
    error,
    isLoading,
  };
};

interface Token {
  id: string;
  name: string;
  symbol: string;
  color: string;
  balance: string;
}

export function TokensMapping(address: string): Token[] {
  const { balances } = useFetchBalances(address || "");

  const tokens: Token[] = [
    {
      id: "idrx",
      name: "Indonesian Rupiah",
      symbol: "IDRX",
      color: "#FF0000",
      balance:
        balances[0]?.status === "success"
          ? formatIDR(formatEther(balances[0].result as bigint))
          : "0.0",
    },
    {
      id: "usdc",
      name: "USD Coin",
      symbol: "USDC",
      color: "#2775CA",
      balance:
        balances[1]?.status === "success"
          ? formatUSD(formatEther(balances[1].result as bigint))
          : "0.0",
    },
    {
      id: "eurc",
      name: "Euro Coin",
      symbol: "EURC",
      color: "#0052B4",
      balance:
        balances[2]?.status === "success"
          ? formatEUR(formatEther(balances[2].result as bigint))
          : "0.0",
    },
  ];

  return tokens;
}
