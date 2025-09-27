"use client";

import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { TESTNET_COUNTER_PACKAGE_ID } from "../../constants";

export default function CreateCampaign() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleCreate = async () => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::create_campaign`,
      arguments: [tx.pure.u64(goal), tx.pure.u64(deadline)],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (res) => {
          console.log("✅ Campaign created:", res);
          alert("Campaign created successfully!");
        },
        onError: (err) => {
          console.error("❌ Error:", err);
          alert("Failed to create campaign.");
        },
      }
    );
  };

return (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
    <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-10 border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
        🎯 Create a New Campaign
      </h2>

      <div className="space-y-6">
        {/* Goal input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Enter funding goal"
              className="flex-1 px-4 py-3 text-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <span className="px-3 text-gray-600 font-medium bg-gray-100 border-l">
              SUI
            </span>
          </div>
        </div>

        {/* Deadline input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deadline
          </label>
          <input
            type="datetime-local"
            onChange={(e) => {
              const value = e.target.value; // e.g. "2028-07-02T19:49"
              if (value) {
                const ts = Math.floor(new Date(value).getTime() / 1000);
                setDeadline(ts.toString()); // store UNIX seconds
              }
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg 
                       bg-white text-gray-900 placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Stored as UNIX timestamp: {deadline || "Not selected"}
          </p>
        </div>

        {/* Submit button */}
        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3.5 rounded-xl transition-colors shadow-md"
        >
          🚀 Create Campaign
        </button>
      </div>
    </div>
  </div>
);}