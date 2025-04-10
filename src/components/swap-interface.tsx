"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

// import TokenSelector from "./token-selector";
// import ConversionRateDisplay from "./conversion-rate-display";
import { useAccount } from "wagmi";
import { TokensMapping } from "../custom-hooks/readContracts";
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

// Token types and initial data
export type Token = {
  id: string;
  name: string;
  symbol: string;
  color: string;
  balance: number;
};

// Exchange rate simulation
const getExchangeRate = (from: string, to: string): number => {
  const exchangeRates: Record<string, number> = {
    "IDRX-USDC": 0.0000606, // 1 IDRX = 0.0000606 USDC (1/16500)
    "IDRX-EURC": 0.0000557, // 1 IDRX = 0.0000557 EURC (1/17944)
    "USDC-IDRX": 16500, // 1 USDC = 16500 IDRX
    "USDC-EURC": 1.09, // 1 USDC = 1.09 EURC
    "EURC-IDRX": 17944, // 1 EURC = 17944 IDRX
    "EURC-USDC": 0.92, // 1 EURC = 0.92 USDC
  };

  if (from === to) return 1;
  const key = `${from.toUpperCase()}-${to.toUpperCase()}`;
  return exchangeRates[key] || 1;
};

export default function SwapInterface() {
  const { address } = useAccount();
  const mappedTokens = TokensMapping(address || "");
  const tokens = mappedTokens.map((token) => ({
    ...token,
    balance: Number(token.balance),
  }));

  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [rateHistory, setRateHistory] = useState<number[]>([]);
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);
  const [isSlippageOpen, setIsSlippageOpen] = useState<boolean>(false);
  const [swapFee, setSwapFee] = useState(0.3);
  const mappingToken = TokensMapping(address || "");
  console.log({ mappingToken });
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
      const newRate = getExchangeRate(fromToken.id, toToken.id);
      setRate(newRate);
      setSwapFee(0.3);

      setConvertedAmount(Number(amount) * newRate);

      setRateHistory((prev) => [...prev.slice(-9), newRate]);
    };

    updateRate();
    const interval = setInterval(updateRate, 3000);
    return () => clearInterval(interval);
  }, [fromToken.id, toToken.id, amount]);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setFromToken(toToken);
      setToToken(fromToken);
      setIsSwapping(false);
    }, 300);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and a single decimal point
    if (value === "" || /^(\d*\.?\d{0,6})$/.test(value)) {
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
                fromToken={fromToken}
                tokens={tokens}
                amount={amount}
                setFromToken={setFromToken}
                handleAmountChange={handleAmountChange}
              />

              {/* Swap button */}
              <SwitchButton isSwapping={isSwapping} handleSwap={handleSwap} />

              {/* To token */}
              <InputToken
                direction="to"
                fromToken={toToken}
                tokens={tokens}
                amount=""
                setFromToken={setFromToken}
                handleAmountChange={handleAmountChange}
              />

              {/* Slippage info */}
              <SlippageInfo slippageTolerance={slippageTolerance} />

              {/* Expected Calculation */}
              {amount && fromToken.id !== toToken.id && (
                <ExpectedCalculation
                  fromToken={fromToken}
                  toToken={toToken}
                  rate={rate}
                  convertedAmount={convertedAmount}
                  swapFee={swapFee}
                />
              )}

              {/* Swap button */}
              <SwapButton
                fromToken={fromToken}
                toToken={toToken}
                amount={amount}
                address={address}
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
