"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, ArrowRight, Settings2, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import TokenSelector from "./token-selector";
// import ConversionRateDisplay from "./conversion-rate-display";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { TokensMapping } from "../custom-hooks/readContracts";

// Token types and initial data
export type Token = {
  id: string;
  name: string;
  symbol: string;
  color: string;
  balance: number;
};

// Exchange rate simulation
// const getExchangeRate = (from: string, to: string): number => {
//   const rates: Record<string, Record<string, number>> = {
//     idrx: {
//       usdc: 0.000063 + (Math.random() * 0.000002 - 0.000001),
//       eurc: 0.000058 + (Math.random() * 0.000002 - 0.000001),
//     },
//     usdc: {
//       eurc: 0.92 + (Math.random() * 0.02 - 0.01),
//       idrx: 15750 + (Math.random() * 300 - 150),
//     },
//     eurc: {
//       usdc: 1.08 + (Math.random() * 0.02 - 0.01),
//       idrx: 17100 + (Math.random() * 300 - 150),
//     },
//   };

//   if (from === to) return 1;
//   return rates[from]?.[to] || 1;
// };

export default function SwapInterface() {
  // const [fromToken, setFromToken] = useState<Token>(TokensMapping[0]);
  // const [toToken, setToToken] = useState<Token>(TokensMapping[1]);
  const [amount, setAmount] = useState<string>("100");
  // const [rate, setRate] = useState<number>(0);
  // const [convertedAmount, setConvertedAmount] = useState<number>(0);
  // const [isSwapping, setIsSwapping] = useState<boolean>(false);
  // const [rateHistory, setRateHistory] = useState<number[]>([]);
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);
  const [isSlippageOpen, setIsSlippageOpen] = useState<boolean>(false);

  const { address } = useAccount();
  const mappingToken = TokensMapping(address || "");
  // useEffect(() => {
  //   if (error) {
  //     console.error("Error fetching balances:", error);
  //   }
  //   if (balances && balances.length > 0) {
  //     // Update token balances when data is available
  //     const updatedTokens = tokens.map((token, index) => ({
  //       ...token,
  //       balance: balances[index]?.result ? Number(balances[index].result) : 0,
  //     }));
  //     // Update the tokens state here if needed
  //     console.log("Updated tokens with balances:", updatedTokens);
  //   }
  // }, [balances, error]);

  // Simulate real-time rate updates
  // useEffect(() => {
  //   const updateRate = () => {
  //     const newRate = getExchangeRate(fromToken.id, toToken.id);
  //     setRate(newRate);
  //     setConvertedAmount(Number.parseFloat(amount || "0") * newRate);
  //     setRateHistory((prev) => [...prev.slice(-9), newRate]);
  //   };

  //   updateRate();
  //   const interval = setInterval(updateRate, 3000);
  //   return () => clearInterval(interval);
  // }, [fromToken.id, toToken.id, amount]);

  // const handleSwap = () => {
  //   setIsSwapping(true);
  //   setTimeout(() => {
  //     setFromToken(toToken);
  //     setToToken(fromToken);
  //     setIsSwapping(false);
  //   }, 300);
  // };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and a single decimal point
    if (/^(\d*\.?\d{0,6})$/.test(value) || value === "") {
      setAmount(value);
      // setConvertedAmount(Number.parseFloat(value || "0") * rate);
    }
  };

  const handleSlippageChange = (value: number) => {
    setSlippageTolerance(value);
  };

  return (
    <div className="w-full max-w-md mt-24">
      {/* Logo and title */}
      <motion.div
        className="flex flex-col items-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">
          WOWOswap
        </h1>
        <p className="text-gray-400 mt-1">Seamless Stablecoin Swaps</p>
      </motion.div>

      {/* Minimalist conversion rate display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        {/* <ConversionRateDisplay
          fromToken={fromToken}
          toToken={toToken}
          rate={rate}
          rateHistory={rateHistory}
        /> */}
      </motion.div>

      {/* Main swap card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ y: -4 }}
      >
        <Card className="bg-gray-900 border-gray-800 shadow-xl overflow-hidden rounded-3xl">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Card header with slippage settings */}
              <div className="flex justify-between items-center">
                <h2 className="text-white font-medium">Swap Tokens</h2>
                <Popover open={isSlippageOpen} onOpenChange={setIsSlippageOpen}>
                  <PopoverTrigger asChild>
                    <motion.button
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-white transition-all duration-200"
                      whileHover={{ rotate: 30, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{ rotate: isSlippageOpen ? 30 : 0 }}
                    >
                      <Settings2 className="w-4 h-4" />
                      <span className="sr-only">
                        Slippage Tolerance Settings
                      </span>
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4 bg-gray-800 border-gray-700 text-white rounded-xl">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Percent className="w-4 h-4 mr-2 text-gray-400" />
                        <h3 className="text-sm font-medium">
                          Slippage Tolerance
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[0.1, 0.5, 1.0, 2.0].map((value) => (
                          <Button
                            key={value}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSlippageChange(value)}
                            className={cn(
                              "rounded-full px-3 py-1 h-auto text-xs font-medium",
                              slippageTolerance === value
                                ? "bg-white text-black border-white"
                                : "bg-gray-750 text-gray-300 border-gray-700 hover:bg-gray-700"
                            )}
                          >
                            {value}%
                          </Button>
                        ))}
                        <div className="flex items-center bg-gray-750 rounded-full px-3 py-1 border border-gray-700">
                          <input
                            type="text"
                            value={
                              slippageTolerance === 0.1 ||
                              slippageTolerance === 0.5 ||
                              slippageTolerance === 1.0 ||
                              slippageTolerance === 2.0
                                ? ""
                                : slippageTolerance
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              if (
                                /^(\d*\.?\d{0,1})$/.test(value) ||
                                value === ""
                              ) {
                                handleSlippageChange(
                                  Number.parseFloat(value) || 0
                                );
                              }
                            }}
                            className="w-10 bg-transparent text-white text-xs text-center focus:outline-none"
                            placeholder="Custom"
                          />
                          <span className="text-xs text-gray-400">%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">
                        Your transaction will revert if the price changes
                        unfavorably by more than this percentage.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Available Balance section */}
              <div className="bg-gray-800/50 rounded-xl p-3">
                <h3 className="text-sm text-gray-400 mb-2">
                  Available Balance
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {mappingToken.map((token) => (
                    <div key={token.id} className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                        style={{ backgroundColor: token.color }}
                      >
                        <span className="text-xs font-bold text-white">
                          {token.symbol.charAt(0)}
                        </span>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {token.symbol}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {token.balance} {token.symbol}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* From token */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-400">From</label>
                  <span className="text-sm text-gray-400">
                    {/* Balance: {fromToken.balance.toLocaleString()}{" "}
                    {fromToken.symbol} */}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {/* <TokenSelector
                    selectedToken={fromToken}
                    tokens={tokens}
                    onSelect={setFromToken}
                  /> */}
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="flex-1 bg-gray-800 border-0 rounded-xl p-3 text-white text-xl focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-300 hover:bg-gray-750 focus:bg-gray-750"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Swap button */}
              <div className="relative flex justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    rotate: 180,
                    backgroundColor: "#ffffff",
                    color: "#000000",
                  }}
                  whileTap={{ scale: 0.9 }}
                  // animate={{ rotate: isSwapping ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  // onClick={handleSwap}
                  className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 border border-gray-700 text-white shadow-lg"
                >
                  <ArrowDownUp className="w-5 h-5" />
                </motion.button>
              </div>

              {/* To token */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-400">To</label>
                  <span className="text-sm text-gray-400">
                    {/* Balance: {toToken.balance.toLocaleString()} {toToken.symbol} */}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {/* <TokenSelector
                    selectedToken={toToken}
                    tokens={tokens}
                    onSelect={setToToken}
                  /> */}
                  {/* <div className="flex-1 bg-gray-800 rounded-xl p-3 text-white text-xl transition-all duration-300 hover:bg-gray-750">
                    <motion.span
                      key={convertedAmount.toString()}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {convertedAmount.toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                    </motion.span>
                  </div> */}
                </div>
              </div>

              {/* Slippage info */}
              <div className="flex justify-between items-center text-xs text-gray-400 px-1">
                <span>Slippage Tolerance:</span>
                <span className="font-medium text-gray-300">
                  {slippageTolerance}%
                </span>
              </div>

              {/* Expected Calculation */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center mb-2">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="7"
                      width="20"
                      height="14"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <h3 className="text-sm font-medium text-blue-400">
                    Expected Calculation
                  </h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Exchange Rate:</span>
                    {/* <span className="text-white font-medium">
                      1 {fromToken.symbol} ={" "}
                      {rate.toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}{" "}
                      {toToken.symbol}
                    </span> */}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Expected Output:</span>
                    {/* <span className="text-white font-medium">
                      {convertedAmount.toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}{" "}
                      {toToken.symbol}
                    </span> */}
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <svg
                      className="w-3 h-3 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>Rate includes % swap fee</span>
                  </div>
                </div>
              </div>

              {/* Swap button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full h-14 text-lg font-medium bg-white hover:bg-gray-200 text-black rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  onClick={() => {}}
                >
                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    Swap
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="mt-8 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p>WOWOswap v1.0 • Simulated Exchange</p>
      </motion.div>
    </div>
  );
}
