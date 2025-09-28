"use client";

import { useEffect, useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { fetchUserCampaigns } from "../lib/fetchUserCampaigns";
import { TESTNET_COUNTER_PACKAGE_ID } from "../constants";
import { Transaction } from "@mysten/sui/transactions";

const CLOCK_OBJECT_ID = "0x6"; // ✅ Sui system clock object

export default function MyCampaignsPage() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [data, setData] = useState<{
    adminCampaigns: any[];
    ownerCampaigns: any[];
    contributorCampaigns: any[];
  }>({ adminCampaigns: [], ownerCampaigns: [], contributorCampaigns: [] });

  useEffect(() => {
    if (account?.address) {
      console.log("🔑 Wallet connected:", account.address);
      fetchUserCampaigns(account.address).then((res) => {
        console.log("📦 Data from fetchUserCampaigns:", res);
        setData(res);
      });
    }
  }, [account]);

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center text-gray-900">
        🔑 Please connect your wallet
      </div>
    );
  }

  // 🔹 Refund handler
  const handleRefund = (campaignId: string) => {
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::refund`,
        arguments: [tx.object(campaignId), tx.object(CLOCK_OBJECT_ID)],
      });

      console.log("📤 Refund transaction:", { campaignId, CLOCK_OBJECT_ID });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (res) => {
            console.log("✅ Refund success:", res);
            alert("🔄 Refund executed successfully!");
          },
          onError: (err) => {
            console.error("❌ Refund failed:", err);
            alert("❌ Refund failed: " + err.message);
          },
        }
      );
    } catch (err) {
      console.error("Refund error:", err);
    }
  };

  // 🔹 Claim funds handler
  const handleClaim = (campaignId: string) => {
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::claim_funds`,
        arguments: [tx.object(campaignId)],
      });

      console.log("📤 Claim transaction:", { campaignId });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (res) => {
            console.log("✅ Claim success:", res);
            alert("💰 Funds claimed successfully!");
          },
          onError: (err) => {
            console.error("❌ Claim failed:", err);
            alert("❌ Claim failed: " + err.message);
          },
        }
      );
    } catch (err) {
      console.error("Claim error:", err);
    }
  };

  const CampaignCard = ({
    c,
    role,
    actionLabel,
    onAction,
    currentUser,
  }: {
    c: any;
    role: string;
    actionLabel: string;
    onAction: () => void;
    currentUser: string | undefined;
  }) => {
    console.log(`📝 Rendering campaign (${role}):`, c);

    const now = Date.now();
    const isExpired = now > Number(c.deadline);

    // 🔎 Check if user is a contributor
    const isContributor = c.contributions?.some(
      (contrib: any) =>
        contrib.contributor.toLowerCase() === currentUser?.toLowerCase()
    );

    return (
      <div
        className={`p-5 border rounded-xl mb-6 shadow-md text-gray-900
          ${role === "admin" ? "bg-yellow-50" : ""}
          ${role === "owner" ? "bg-green-50" : ""}
          ${role === "contributor" ? "bg-blue-50" : ""}
        `}
      >
        <h3 className="font-bold text-xl mb-1">
          {c.name || "Untitled Campaign"}
        </h3>
        <p className="text-gray-800 mb-3">
          {c.description || "No description provided."}
        </p>
        <p className="text-xs text-gray-700 mb-2">ID: {c.id}</p>

        <div className="space-y-1 mb-3 text-gray-900">
          <p>
            🎯 Goal: <b>{c.goal} MIST</b>
          </p>
          <p>
            📊 Raised: <b>{c.totalRaised} MIST</b>
          </p>
          <p>📅 Deadline: {new Date(c.deadline).toLocaleString()}</p>
        </div>

        {isContributor && (
          <p className="text-blue-600 font-semibold mb-3">
            🙋 You are a contributor to this campaign!
          </p>
        )}

        {/* Lista de contribuidores */}
        {c.contributions && c.contributions.length > 0 && (
          <div className="mb-3">
            <h4 className="font-semibold text-gray-900">🤝 Contributors:</h4>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {c.contributions.map((contrib: any, idx: number) => (
                <li key={idx}>
                  {contrib.contributor.slice(0, 10)}... → {contrib.amount} MIST
                  {contrib.refunded && " (refunded)"}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 🔹 Owner buttons */}
        {role === "owner" && (
          <>
            {c.totalRaised >= c.goal && c.isActive ? (
              <button
                onClick={onAction}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                💰 Claim Funds
              </button>
            ) : !c.isActive ? (
              <p className="text-gray-500">⚠️ Funds already claimed</p>
            ) : (
              <p className="text-red-600">❌ Goal not reached yet</p>
            )}
          </>
        )}

        {/* 🔹 Contributor buttons */}
        {role === "contributor" && (
          <>
            {c.isActive && !isExpired ? (
              <p className="text-gray-500">⏳ Contract Active</p>
            ) : c.totalRaised < c.goal ? (
              <button
                onClick={onAction}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                🔄 Request Refund
              </button>
            ) : (
              <p className="text-green-600">
                ✅ Goal reached — no refund possible
              </p>
            )}
          </>
        )}

        {/* 🔹 Admin buttons */}
        {role === "admin" && c.totalRaised < c.goal && c.isActive && (
          <button
            onClick={onAction}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            🔄 Force Refund
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-10 text-gray-900 bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-8">📋 My Campaigns</h1>

      {/* Admin Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">👮 Admin Campaigns</h2>
        {data.adminCampaigns.length > 0 ? (
          data.adminCampaigns.map((c) => (
            <CampaignCard
              key={c.id}
              c={c}
              role="admin"
              actionLabel="🔄 Refund"
              onAction={() => handleRefund(c.id)}
              currentUser={account?.address}
            />
          ))
        ) : (
          <p className="text-gray-600">No admin campaigns found.</p>
        )}
      </section>

      {/* Owner Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">🧑 Owner Campaigns</h2>
        {data.ownerCampaigns.length > 0 ? (
          data.ownerCampaigns.map((c) => (
            <CampaignCard
              key={c.id}
              c={c}
              role="owner"
              actionLabel="💰 Claim Funds"
              onAction={() => handleClaim(c.id)}
              currentUser={account?.address}
            />
          ))
        ) : (
          <p className="text-gray-600">No owner campaigns found.</p>
        )}
      </section>

      {/* Contributor Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🤝 Contributor Campaigns</h2>
        {data.contributorCampaigns.length > 0 ? (
          data.contributorCampaigns.map((c) => (
            <CampaignCard
              key={c.id}
              c={c}
              role="contributor"
              actionLabel="🔄 Request Refund"
              onAction={() => handleRefund(c.id)}
              currentUser={account?.address}
            />
          ))
        ) : (
          <p className="text-gray-600">No contributions found.</p>
        )}
      </section>
    </div>
  );
}
