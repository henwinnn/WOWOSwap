"use client";

import { Token } from "./swap-interface";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface SwapButtonProps {
  fromToken: Token;
  toToken: Token;
  amount: string;
  address: `0x${string}` | undefined;
  hasEnoughBalance: boolean;
  handleSwapTransaction: () => void;
}

export default function SwapButton({
  fromToken,
  toToken,
  amount,
  address,
  hasEnoughBalance,

  handleSwapTransaction,
}: SwapButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        className="w-full h-14 text-lg font-medium bg-white hover:bg-gray-200 text-black rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
        onClick={handleSwapTransaction}
        disabled={
          !amount ||
          !address ||
          fromToken.id === toToken.id ||
          !hasEnoughBalance
        }
      >
        <motion.div
          className="flex items-center"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {hasEnoughBalance ? "Swap" : "Insufficient Funds"}
          <ArrowRight className="ml-2 w-5 h-5" />
        </motion.div>
      </Button>
    </motion.div>
  );
}
