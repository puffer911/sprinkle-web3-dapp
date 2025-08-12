"use client";

import { useEffect, useState } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { FaCoins } from 'react-icons/fa';
import { GiTrophyCup, GiFlowerPot } from 'react-icons/gi';

// Define the structure of our TipJar resource
type TipJarResource = {
  total_tipped_amount: string; // The value comes back as a string
};


const StreamerProfile = ({ streamerAddress }: { streamerAddress: string }) => {
  const [totalTipped, setTotalTipped] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the Aptos client
  const aptosConfig = new AptosConfig({ network: Network.DEVNET }); // Or TESTNET, MAINNET
  const aptos = new Aptos(aptosConfig);

  const moduleAddress = process.env.NEXT_PUBLIC_MODULE_ADDRESS;

  useEffect(() => {
    if (!streamerAddress || !moduleAddress?.startsWith("0x")) {
      setError("Streamer address or module address is not valid.");
      setIsLoading(false);
      return;
    }

    const fetchTotalTipped = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resource = await aptos.getAccountResource({
          accountAddress: streamerAddress,
          resourceType: `${moduleAddress}::tip_jar::TipJar`,
        });
        const data = resource as TipJarResource;
        // Convert from Octa (10^-8 APT) to APT
        setTotalTipped(parseInt(data.total_tipped_amount, 10) / 10 ** 8);
      } catch (e: any) {
        if (e.status === 404) {
          setError("This streamer has not created a Tip Jar yet.");
        } else {
          setError("Failed to fetch data. See console for details.");
          console.error(e);
        }
        setTotalTipped(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalTipped();
  }, [streamerAddress, moduleAddress]);

  return (
    <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-6 rounded-2xl shadow-2xl text-center text-white transform transition-all hover:scale-[1.02]">
      <div className="flex justify-center items-center mb-4">
        <GiFlowerPot className="text-4xl mr-3 text-yellow-300" />
        <h2 className="text-2xl font-bold drop-shadow-lg">Creator Profile</h2>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
        <p className="text-sm font-mono break-all flex items-center justify-center">
          <FaCoins className="mr-2 text-yellow-300" />
          {streamerAddress}
        </p>
      </div>
      
      {!isLoading && !error && totalTipped !== null && (
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm mb-2 flex items-center justify-center">
            <GiTrophyCup className="mr-2 text-yellow-300" /> Total Tips Received
          </p>
          <p className="text-4xl font-bold text-yellow-300 flex items-center justify-center">
            <FaCoins className="mr-2" />
            {totalTipped.toFixed(4)} APT
          </p>
        </div>
      )}
    </div>
  );
};

export default StreamerProfile;
