"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { TESTNET_COUNTER_PACKAGE_ID } from "../constants";

export default function ContributePage() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id"); // passed via URL: /contribute?id=0x...

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [amount, setAmount] = useState("");

  const handleContribute = async () => {
    if (!campaignId || !amount) {
      alert("Missing campaign ID or amount");
      return;
    }

    try {
      const tx = new TransactionBlock();

      // split the gas coin to create a contribution coin
      const [contributionCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);

      // call Move function
      tx.moveCall({
        target: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::contribute`,
        arguments: [tx.object(campaignId), contributionCoin],
      });

      // ✅ Corrected: use "transaction" not "transactionBlock"
        signAndExecute(
        { transaction: tx as any },  // 👈 cast to any fixes the TS type issue
        {
            onSuccess: () => {
            alert("✅ Contribution successful!");
            window.location.href = "/campaigns";
            },
            onError: (err) => {
            console.error("❌ Contribution failed:", err);
            alert("Contribution failed.");
            },
        }
        );
    } catch (err) {
      console.error("❌ Error building transaction:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          Contribute to Campaign {campaignId?.slice(0, 8)}...
        </h1>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in SUI"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4
                     bg-white text-gray-900 placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <button
          onClick={handleContribute}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-3.5 
                     rounded-xl transition-colors shadow-md"
        >
          🚀 Confirm Contribution
        </button>
      </div>
    </div>
  );
}
