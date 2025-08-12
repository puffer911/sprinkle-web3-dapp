"use client";
import { GiFlowerPot } from 'react-icons/gi';
import Link from 'next/link';
import ConnectWalletButton from "@/components/ConnectWalletButton";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
      <Link href="/" className="flex items-center">
        <GiFlowerPot className="mr-3 text-3xl text-yellow-300" />
        <div>
          <h1 className="text-2xl font-bold tracking-wide">
            Sprinkle
          </h1>
          <small className="text-xs text-yellow-200 opacity-80">
            Support Creators Instantly
          </small>
        </div>
      </Link>
      
      <ConnectWalletButton /> 
    </header>
  );
}