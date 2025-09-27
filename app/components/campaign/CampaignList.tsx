"use client";

import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { TESTNET_COUNTER_PACKAGE_ID } from "../../constants";

export default function CreateCampaign() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleCreate = async () => {
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::create_campaign`,
      arguments: [tx.pure.u64(goal), tx.pure.u64(deadline)],
    });

    signAndExecute(
      { transactionBlock: tx },
      {
        onSuccess: (res) => console.log("✅ Campaign created:", res),
        onError: (err) => console.error("❌ Error:", err),
      }
    );
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold">Create Campaign</h2>
      <input
        className="border p-2 mr-2"
        placeholder="Goal (SUI)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <input
        className="border p-2 mr-2"
        placeholder="Deadline (timestamp)"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={handleCreate}>
        Create
      </button>
    </div>
  );
}
