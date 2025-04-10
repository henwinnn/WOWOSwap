"use client";

import { motion } from "framer-motion";
import TokenSelector from "./token-selector";
import { Token } from "./swap-interface";

interface InputTokenProps {
  direction: "from" | "to";
  fromToken: Token;
  tokens: Token[];
  amount: string;
  setFromToken: (token: Token) => void;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputToken({
  direction,
  fromToken,
  tokens,
  amount,
  setFromToken,
  handleAmountChange,
}: InputTokenProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm text-gray-400">{direction}</label>
        <span className="text-sm text-gray-400">
          {/* Balance: {fromToken.balance.toLocaleString()}{" "}
                        {fromToken.symbol} */}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <TokenSelector
          selectedToken={fromToken}
          tokens={tokens}
          onSelect={setFromToken}
        />
        {direction == "from" ? (
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="flex-1 bg-gray-800 border-0 rounded-xl p-3 text-white text-xl focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-300 hover:bg-gray-750 focus:bg-gray-750"
            placeholder="0.00"
          />
        ) : (
          <div className="flex-1 bg-gray-800 rounded-xl p-3 text-white text-xl transition-all duration-300 hover:bg-gray-750">
            <motion.span
              // key={convertedAmount.toString()}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              0
            </motion.span>
          </div>
        )}
      </div>
    </div>
  );
}
