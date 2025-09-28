"use client";
import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { TESTNET_COUNTER_PACKAGE_ID } from "../constants";

export default function ContributePage() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id"); 
  if (!campaignId) return null;

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [amount, setAmount] = useState("");
  const [nftUrl, setNftUrl] = useState<string | null>(null); // <- estado del NFT

  const handleContribute = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("⚠️ Enter a valid contribution amount");
      return;
    }

    try {
      const tx = new Transaction();

      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);

      tx.moveCall({
        target: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::contribute`,
        arguments: [
          tx.object(campaignId),
          coin,
          tx.object("0x6"),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (res) => {
            console.log("✅ Contribution sent:", res);

            // ⚡ simplificación: como ya sabemos que el NFT tiene url fija o viene de la campaña
            const defaultUrl =
              "https://raw.githubusercontent.com/Pablo-br/mi-nft-imagen/refs/heads/main/ChatGPT%20Image%2028%20sept%202025%2C%2002_29_24.png";

            setNftUrl(defaultUrl); // 🔥 muestra el modal con la imagen
          },
          onError: (err) => {
            console.error("❌ Error executing transaction:", err);
            alert("Failed to contribute.");
          },
        }
      );
    } catch (err) {
      console.error("❌ Error building transaction:", err);
    }
  };

  return (
    <Suspense fallback={<div>Loading…</div>}>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          Contribute to Campaign {campaignId.slice(0, 8)}...
        </h1>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in MIST"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4
                     bg-white text-gray-900 placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <button
          onClick={handleContribute}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
        >
          💸 Contribute
        </button>
      </div>

      {/* Modal NFT 🎉 */}
      {nftUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              🎉 Congratulations!
            </h2>
            <p className="mb-4 text-gray-700">
              You just received a special NFT for your contribution:
            </p>
            <img
              src={nftUrl}
              alt="NFT reward"
              className="w-64 h-64 mx-auto rounded-lg shadow-md"
            />
            <button
              onClick={() => setNftUrl(null)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </Suspense>
  );
}
