"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { FaCoins, FaPowerOff } from "react-icons/fa";
import { WalletName } from "@aptos-labs/wallet-adapter-react";


// Helper function to shorten a wallet address
const shortenAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function ConnectWalletButton() {
  const {
    connect,
    disconnect,
    account,
    connected,
    wallets = [],
  } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleConnect = () => {
    if (wallets.length > 0) {
      connect(wallets[0].name);
    } else {
      alert("No Aptos wallets found. Please install a wallet like Petra, Pontem, or Martian.");
    }
  };

  const handleWalletSelect = (walletName: WalletName) => {
    connect(walletName);
    setIsModalOpen(false);
  };

  if (connected && account) {
    return (
      <div className="flex items-center gap-4 bg-gradient-to-r from-pink-600 to-purple-600 p-2 rounded-full shadow-lg">
        <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full">
          <FaCoins className="mr-2 text-yellow-300" />
          <span className="text-white font-mono text-sm">
          {shortenAddress(account.address)}
        </span>
        </div>
        <button
          onClick={disconnect}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all group"
        >
          <FaPowerOff className="group-hover:rotate-180 transition-transform" />
        </button>
            </div>
    );
  }

  // If multiple Aptos wallets available, show selection modal
  if (wallets.length > 1) {
  return (
      <div className="relative">
    <button
          onClick={() => setIsModalOpen(!isModalOpen)}
      className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
    >
          Connect Wallet
    </button>

        {isModalOpen && (
          <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg min-w-48 z-50">
            <div className="p-2">
              <p className="text-gray-300 text-sm font-medium mb-2 px-2">
                Choose Wallet
              </p>
              {wallets.map((w) => (
                <button
                  key={w.name}
                  onClick={() => handleWalletSelect(w.name)}
                  className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  {w.icon && (
                    <img
                      src={w.icon}
                      alt={w.name}
                      className="w-6 h-6"
                    />
                  )}
                  {w.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Close modal when clicking outside */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsModalOpen(false)}
          />
        )}
      </div>
  );
}

  // Single wallet or no wallets
  return (
    <button
      onClick={handleConnect}
      className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
      disabled={wallets.length === 0}
    >
      {wallets.length === 0 ? "No Aptos Wallets" : "Connect Wallet"}
    </button>
  );
}
