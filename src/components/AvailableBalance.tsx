"use client";

import { TokensMapping } from "@/custom-hooks/readContracts";

interface CardHeaderProps {
  address: string;
}

export default function AvailableBalance({ address }: CardHeaderProps) {
  const mappingToken = TokensMapping(address);
  return (
    <div className="bg-gray-800/50 rounded-xl p-3">
      <h3 className="text-sm text-gray-400 mb-2">Available Balance</h3>
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
            <span className="text-gray-400 text-xs">{token.balance}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
