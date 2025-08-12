"use client";

import { useState, useEffect } from 'react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import StreamerProfile from "@/components/StreamerProfile";
import TippingInterface from "@/components/TippingInterface";

export default function TippingPage({ 
  params 
}: { 
  params: { creator_link: string } 
}) {
  const [creatorAddress, setCreatorAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { account } = useWallet();

  useEffect(() => {
    const fetchCreatorAddress = async () => {
      try {
        const aptos = new Aptos(new AptosConfig({ network: Network.DEVNET }));
        const moduleAddress = process.env.NEXT_PUBLIC_MODULE_ADDRESS!;

        const result = await aptos.view({
          payload: {
            function: `${moduleAddress}::tip_jar::get_creator_address_by_link`,
            typeArguments: [],
            functionArguments: [params.creator_link]
          }
        });

        const address = result[0] as string;
        setCreatorAddress(address);
      } catch (err) {
        console.error('Error fetching creator address:', err);
        setError('Could not find creator with this link');
      }
    };

    fetchCreatorAddress();
  }, [params.creator_link]);

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 text-xl">{error}</div>
      </main>
    );
  }

  if (!creatorAddress) {
    return (
      <main className="flex flex-col items-center justify-center p-8">
        <div className="text-gray-500 text-xl">Loading...</div>
      </main>
    );
  }

  const isCreator = account?.address.toString() === creatorAddress;

  return (
    <main className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <StreamerProfile streamerAddress={creatorAddress} />
        {!isCreator && <TippingInterface streamerAddress={creatorAddress} />}
      </div>
    </main>
  );
}