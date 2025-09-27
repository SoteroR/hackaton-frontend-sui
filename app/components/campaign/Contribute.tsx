"use client";

import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { TESTNET_COUNTER_PACKAGE_ID } from "../../constants";

export default function Contribute() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [campaignId, setCampaignId] = useState("");
  const [amount, setAmount] = useState("");

  const handleContribute = async () => {
    try {
      const tx = new TransactionBlock();

      // Split SUI coin for contribution
      const [contributionCoin] = tx.splitCoins(tx.gas, [
        tx.pure.u64(amount),
      ]);

      // Call Move function
      tx.moveCall({
        target: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::contribute`,
        arguments: [
          tx.object(campaignId), // the Campaign object ID
          contributionCoin,      // the Coin<SUI>
        ],
      });

      signAndExecute(
        { transaction: tx as any },
        {
          onSuccess: (res) => {
            console.log("✅ Contributed successfully:", res);
            alert("Contribution successful!");
          },
          onError: (err) => {
            console.error("❌ Contribution failed:", err);
            alert("Contribution failed.");
          },
        }
      );
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-10 border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
          💸 Contribute to a Campaign
        </h2>

        <div className="space-y-6">
          {/* Campaign ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign ID
            </label>
            <input
              type="text"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              placeholder="Enter campaign object ID"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (SUI)
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="flex-1 px-4 py-3 text-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <span className="px-3 text-gray-600 font-medium bg-gray-100 border-l">
                SUI
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleContribute}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-3.5 rounded-xl transition-colors shadow-md"
          >
            🚀 Contribute
          </button>
        </div>
      </div>
    </div>
  );
}
