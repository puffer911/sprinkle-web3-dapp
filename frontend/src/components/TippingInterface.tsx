"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useState } from "react";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { FaCoins, FaPaperPlane, FaGift } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';

const TippingInterface = ({ streamerAddress }: { streamerAddress: string }) => {
  const { connected, signAndSubmitTransaction } = useWallet();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txResult, setTxResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const moduleAddress = process.env.NEXT_PUBLIC_MODULE_ADDRESS;

  const handleTipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      setError("Please connect your wallet.");
      return;
    }

    const tipAmount = parseFloat(amount);
    if (isNaN(tipAmount) || tipAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    const amountInOcta = Math.floor(tipAmount * 10 ** 8);

    const payload: InputTransactionData = {
      data: {
      function: `${moduleAddress}::tip_jar::send_tip`,
        typeArguments: [],
        functionArguments: [streamerAddress, amountInOcta.toString(), message],
      },
    };

    setIsLoading(true);
    setError(null);
    setTxResult(null);

    try {
      const result = await signAndSubmitTransaction(payload);

      const aptosConfig = new AptosConfig({ network: Network.DEVNET });
      const aptos = new Aptos(aptosConfig);
      await aptos.waitForTransaction({ transactionHash: result.hash });

      setTxResult(result.hash);
      setAmount("");
      setMessage("");
    } catch (e: any) {
      setError(e.message || "Transaction failed.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="bg-gradient-to-br from-[#FF6B9E] to-[#4ECDC4] p-6 rounded-2xl shadow-2xl transform transition-all hover:scale-[1.02]">
      <div className="flex items-center justify-center mb-6">
        <GiPartyPopper className="text-4xl mr-3 text-yellow-400" />
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">
          Sprinkle Some Love! 💖
        </h2>
        </div>

      <form onSubmit={handleTipping} className="space-y-4">
        <div className="relative">
          <FaCoins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-10 w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border-2 border-white/30 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Tip Amount (APT)"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="relative">
          <FaGift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400" />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="pl-10 w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border-2 border-white/30 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Write a fun message!"
            maxLength={100}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!connected || isLoading}
          className="w-full flex items-center justify-center py-3 px-6 bg-yellow-400 text-[#FF6B9E] font-bold rounded-full hover:bg-yellow-500 transition-all
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Tip "}
          <FaPaperPlane className="ml-2" />
        </button>
      </form>

      {txResult && (
        <div className="mt-4 text-center bg-green-500/30 backdrop-blur-sm rounded-full py-2 text-white">
          <p>
            Tip Sent! 🎉{" "}
            <a
              href={`${process.env.NEXT_PUBLIC_APTOS_EXPLORER}/txn/${txResult}?network=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View Transaction
            </a>
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-center bg-red-500/30 backdrop-blur-sm rounded-full py-2 text-white">
          <p>Oops! {error}</p>
    </div>
      )}
    </div>
  );
};

export default TippingInterface;

