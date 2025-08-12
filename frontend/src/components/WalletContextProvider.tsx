"use client";

import React from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export default WalletContextProvider;