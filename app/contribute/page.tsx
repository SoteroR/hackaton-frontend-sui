"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { TESTNET_COUNTER_PACKAGE_ID } from "../constants";
import { AutoCoinButton } from "@/autocoinbutton";

export default function ContributePage() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id"); // passed via URL: /contribute?id=0x...
  if (!campaignId){return }

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [amount, setAmount] = useState("");


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

        <AutoCoinButton
          amount = {BigInt(amount)}
          id = {campaignId}
        ></AutoCoinButton>
      </div>
    </div>
  );
}
