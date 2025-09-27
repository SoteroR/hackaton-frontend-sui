"use client";

import { useEffect, useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
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
      fetchUserCampaigns(account.address).then(setData);
    }
  }, [account]);

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center text-gray-700">
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
        arguments: [tx.object(campaignId), tx.object(CLOCK_OBJECT_ID)], // ✅ now correct
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => alert("🔄 Refund executed successfully!"),
          onError: (err) => alert("❌ Refund failed: " + err),
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

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => alert("💰 Funds claimed successfully!"),
          onError: (err) => alert("❌ Claim failed: " + err),
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
  }: {
    c: any;
    role: string;
    actionLabel: string;
    onAction: () => void;
  }) => (
    <div className="p-5 border rounded-xl mb-6 bg-white shadow-md">
      <h3 className="font-bold text-xl mb-1">{c.name || "Untitled Campaign"}</h3>
      <p className="text-gray-700 mb-3">{c.description || "No description provided."}</p>
      <p className="text-xs text-gray-500 mb-2">ID: {c.id}</p>

      <div className="space-y-1 mb-3">
        <p>🎯 Goal: <b>{c.goal} MIST</b></p>
        <p>📊 Raised: <b>{c.totalRaised} MIST</b></p>
        <p>📅 Deadline: {new Date(c.deadline).toLocaleString()}</p>
      </div>

      <div className="mb-3">
        {role === "owner" && c.totalRaised >= c.goal && c.isActive && (
          <p className="text-green-600">✅ You can claim funds</p>
        )}
        {role === "owner" && c.totalRaised < c.goal && (
          <p className="text-red-600">❌ Goal not reached yet</p>
        )}
        {role === "admin" && c.totalRaised < c.goal && (
          <p className="text-yellow-600">⚠️ Refund available if needed</p>
        )}
        {role === "contributor" && c.totalRaised < c.goal && !c.isActive && (
          <p className="text-blue-600">🔄 You can request a refund</p>
        )}
      </div>

      <button
        onClick={onAction}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        {actionLabel}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 text-gray-900 bg-white">
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
            />
          ))
        ) : (
          <p className="text-gray-600">No contributions found.</p>
        )}
      </section>
    </div>
  );
}
