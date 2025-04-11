"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

// import TokenSelector from "./token-selector";
// import ConversionRateDisplay from "./conversion-rate-display";
import { useAccount } from "wagmi";
import { TokensMapping, usePoolBalances } from "../custom-hooks/readContracts";
import ConversionRateDisplay from "./conversion-rate-display";
import Title from "./Title";
import CardHeaderSlippage from "./CardHeaderSlippage";
import AvailableBalance from "./AvailableBalance";
import InputToken from "./InputToken";
import SwitchButton from "./SwitchButton";
import SlippageInfo from "./SlippageInfo";
import ExpectedCalculation from "./ExpectedCalculation";
import SwapButton from "./SwapButton";
import Footer from "./Footer";
import { calculateSwapOutput, getMinDy } from "@/lib/utils";
import { useWriteContractSwap } from "@/custom-hooks/writeContracts";

// Token types and initial data
export type Token = {
  id: string;
  index: number;
  name: string;
  symbol: string;
  color: string;
  balance: number;
};

// Exchange rate simulation
// const getExchangeRate = (from: string, to: string): number => {
//   const exchangeRates: Record<string, number> = {
//     "IDRX-USDC": 0.0000606, // 1 IDRX = 0.0000606 USDC (1/16500)
//     "IDRX-EURC": 0.0000557, // 1 IDRX = 0.0000557 EURC (1/17944)
//     "USDC-IDRX": 16500, // 1 USDC = 16500 IDRX
//     "USDC-EURC": 1.09, // 1 USDC = 1.09 EURC
//     "EURC-IDRX": 17944, // 1 EURC = 17944 IDRX
//     "EURC-USDC": 0.92, // 1 EURC = 0.92 USDC
//   };

//   if (from === to) return 1;
//   const key = `${from.toUpperCase()}-${to.toUpperCase()}`;
//   return exchangeRates[key] || 1;
// };

export default function SwapInterface() {
  const { address } = useAccount();
  const { swap } = useWriteContractSwap();
  const mappedTokens = TokensMapping(address);
  const tokens = mappedTokens.map((token) => ({
    ...token,
    balance: Number(token.balance),
  }));

  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const [rate, setRate] = useState("0");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [rateHistory, setRateHistory] = useState<number[]>([]);
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);
  const [isSlippageOpen, setIsSlippageOpen] = useState<boolean>(false);
  const [swapFee, setSwapFee] = useState(0.3);
  const balances = usePoolBalances();
  const multipliers = [1, 16500, 17944].map(BigInt);
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
  useEffect(() => {
    const updateRate = () => {
      const newRate = rate;
      // setRate(newRate);
      setSwapFee(0.3);

      setConvertedAmount(Number(amountIn) * Number(newRate));

      setRateHistory((prev) => [...prev.slice(-9), Number(newRate)]);
    };

    updateRate();
    const interval = setInterval(updateRate, 3000);
    return () => clearInterval(interval);
  }, [
    fromToken.id,
    rate,
    fromToken.index,
    toToken.id,
    toToken.index,
    amountIn,
  ]);

  useEffect(() => {
    if (amountIn && !isNaN(Number(amountIn))) {
      try {
        const inputBigInt = BigInt(Math.floor(Number(amountIn) * 1e18));
        const setDefaultRate = BigInt(Math.floor(Number(1) * 1e18));
        let output;
        let defaultRate;
        if (fromToken?.index !== undefined && toToken?.index !== undefined) {
          output = calculateSwapOutput(
            fromToken?.index,
            toToken?.index,
            inputBigInt,
            balances,
            multipliers
          );

          defaultRate = calculateSwapOutput(
            fromToken?.index,
            toToken?.index,
            setDefaultRate,
            balances,
            multipliers
          );
        }
        console.log("default", defaultRate);
        setRate((Number(defaultRate) / 1e18).toFixed(6));
        setAmountOut((Number(output) / 1e18).toFixed(6));
      } catch (err) {
        console.error("error calculating swap", err);
      }
    } else {
      setAmountOut("0");
    }
  }, [amountIn, fromToken, toToken, rate, balances, multipliers]);

  const handleSwap = () => {
    setIsSwapping(true);
    setConvertedAmount(0);
    setAmountIn("");
    setAmountOut("0");
    setTimeout(() => {
      setFromToken(toToken);
      setToToken(fromToken);
      setIsSwapping(false);
    }, 300);
  };

  const handleSwapTransaction = () => {
    if (!fromToken || !toToken || !amountIn) return;
    const inputBigInt = BigInt(Math.floor(Number(amountIn) * 1e18));
    const outputBigInt = BigInt(Math.floor(Number(amountOut) * 1e18));
    const minDy = getMinDy(outputBigInt, slippageTolerance);
    console.log({ amountOut, minDy });

    swap(fromToken.index, toToken.index, inputBigInt, minDy);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and a single decimal point
    if (value === "" || /^(\d*\.?\d{0,6})$/.test(value)) {
      setAmountIn(value);
      // setConvertedAmount(Number.parseFloat(value || "0") * rate);
    }
  };

  const handleSlippageChange = (value: number) => {
    setSlippageTolerance(value);
    setIsSlippageOpen(false);
  };

  return (
    <div className="w-full max-w-md mt-24">
      {/* Logo and title */}
      <Title />

      {/* Minimalist conversion rate display */}
      <ConversionRateDisplay
        fromToken={fromToken}
        toToken={toToken}
        rate={rate}
        rateHistory={rateHistory}
      />

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
              <CardHeaderSlippage
                isSlippageOpen={isSlippageOpen}
                setIsSlippageOpen={setIsSlippageOpen}
                handleSlippageChange={handleSlippageChange}
                slippageTolerance={slippageTolerance}
              />

              {/* Available Balance section */}
              {address && <AvailableBalance address={address} />}

              {/* From token */}
              <InputToken
                direction="from"
                selectedToken={fromToken}
                otherTokenId={toToken.id}
                tokens={tokens}
                amountIn={amountIn}
                setFromToken={setFromToken}
                handleAmountChange={handleAmountChange}
              />

              {/* Swap button */}
              <SwitchButton isSwapping={isSwapping} handleSwap={handleSwap} />

              {/* To token */}
              <InputToken
                direction="to"
                selectedToken={toToken}
                otherTokenId={fromToken.id}
                tokens={tokens}
                amountIn={amountOut}
                setFromToken={setToToken}
                handleAmountChange={handleAmountChange}
              />

              {/* Slippage info */}
              <SlippageInfo slippageTolerance={slippageTolerance} />

              {/* Expected Calculation */}
              {amountIn && fromToken.id !== toToken.id && (
                <ExpectedCalculation
                  fromToken={fromToken}
                  toToken={toToken}
                  rate={rate}
                  convertedAmount={convertedAmount}
                  swapFee={swapFee}
                  amountOut={amountOut}
                />
              )}

              {/* Swap button */}
              <SwapButton
                fromToken={fromToken}
                toToken={toToken}
                amount={amountIn}
                address={address}
                handleSwapTransaction={handleSwapTransaction}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
