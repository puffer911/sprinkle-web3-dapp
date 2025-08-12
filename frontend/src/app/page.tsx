"use client";

import { useState, useEffect } from 'react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useWallet, InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import Link from 'next/link';


export default function Home() {
  const [creatorLink, setCreatorLink] = useState('');
  const [initializedCreatorLink, setInitializedCreatorLink] = useState('');
  const [hasJar, setHasJar] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();

  const aptos = new Aptos(new AptosConfig({ network: Network.DEVNET }));
  const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS!;

  useEffect(() => {
    const checkJarStatus = async () => {
      if (account) {
        try {
          const resources = await aptos.getAccountResources({
            accountAddress: account.address
          });
          console.log(account)


          const jarResource = resources.find(r => r.type.includes('TipJar') && r.type.includes(MODULE_ADDRESS));
          if (jarResource) {
            // Extract creator link from the resource
            const resourceData = jarResource.data as any;
            const storedCreatorLink = resourceData.creator_link;

            console.log(resourceData)
            
            setHasJar(true);
            setInitializedCreatorLink(storedCreatorLink);
          }
    } catch (error) {
          console.error('Error checking jar status:', error);
    }
      }
  };

    checkJarStatus();
  }, [account]);

  const initializeTipJar = async () => {
    if (!account) {
      alert('Please connect wallet first');
      return;
    }

    try {
      const payload: InputTransactionData = {
        data: {
        function: `${MODULE_ADDRESS}::tip_jar::initialize_tip_jar`,
        typeArguments: [],
        functionArguments: [creatorLink]
        },
      };

      const response = await signAndSubmitTransaction(payload);
      await aptos.waitForTransaction({ transactionHash: response.hash });

      alert('Tip Jar Initialized Successfully!');
      setHasJar(true);
    } catch (error) {
      console.error('Error initializing tip jar:', error);
      alert('Failed to initialize tip jar');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-8 min-h-[calc(100vh-80px)]">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Welcome to Sprinkle
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
        Create your unique creator link and start receiving tips!
      </p>

      {account ? (
        hasJar ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Your Tip Jar is initialized!</p>
            <Link 
              href={`/${initializedCreatorLink}`} 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              View Your Creator Page
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="creatorLink"
              >
                Create Your Unique Creator Link
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="creatorLink"
                type="text"
                placeholder="Enter your unique link"
                value={creatorLink}
                onChange={(e) => setCreatorLink(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                15 characters max, used to create your tipping page
              </p>
            </div>
            <button
              onClick={initializeTipJar}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Initialize Tip Jar
            </button>
          </div>
        )
      ) : (
        <p className="text-center text-gray-600">
          Please connect your wallet to initialize your Tip Jar
        </p>
      )}

      {/* <section className="mt-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Created Creator Links
        </h2>
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-gray-600 text-center">
            Feature coming soon! Stay tuned.
          </p>
        </div>
      </section> */}
    </main>
  );
}