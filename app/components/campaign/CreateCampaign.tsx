"use client";

import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { TESTNET_COUNTER_PACKAGE_ID } from "../../constants";

export default function CreateCampaign() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState(""); // datetime-local
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nftUrl, setNftUrl] = useState(""); // nuevo campo opcional

  const handleCreate = async () => {
    if (!goal || !deadline || !name || !description) {
      alert("⚠️ Please fill in all required fields (Goal, Deadline, Name, Description)");
      return;
    }

    try {
      const tx = new Transaction();

      // Calcular duración en milisegundos
      const now = Date.now();
      const target = new Date(deadline).getTime();
      const durationMs = target - now;
      if (durationMs <= 0) {
        alert("⚠️ Deadline must be in the future");
        return;
      }

      // Procesar URL (si existe)
      let urlBytes: number[] = [];
      if (nftUrl.trim().length > 0) {
        const encoder = new TextEncoder();
        urlBytes = Array.from(encoder.encode(nftUrl));
      }

      tx.moveCall({
        target: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::create_campaign`,
        arguments: [
          tx.pure.u64(goal),             // 🎯 goal
          tx.pure.u64(durationMs),       // ⏳ duración en milisegundos
          tx.pure.string(name),          // 📝 name
          tx.pure.string(description),   // 📝 description
          tx.pure.vector("u8", urlBytes),// 🖼️ nft_url_bytes (vacío = usa la URL por defecto)
          tx.object("0x6"),              // ⏰ Clock
        ],
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
    } catch (err) {
      console.error("❌ Error building transaction:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-10 border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
          🎯 Create a New Campaign
        </h2>

        <div className="space-y-6">
          {/* Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal (MIST)
            </label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Enter funding goal"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white text-gray-900"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              Selected deadline: {deadline || "Not selected"}
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter campaign name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white text-gray-900"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter campaign description"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white text-gray-900"
            />
          </div>

          {/* NFT URL (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NFT Image URL (optional)
            </label>
            <input
              type="text"
              value={nftUrl}
              onChange={(e) => setNftUrl(e.target.value)}
              placeholder="https://example.com/my-nft.png"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              If left empty, a default NFT image will be used.
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleCreate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3.5 rounded-xl transition-colors shadow-md"
          >
            🚀 Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
