"use client";

import { useEffect, useState } from "react";
import { fetchAllCampaigns, Campaign } from "../../lib/fetchAllCampaigns";
import Link from "next/link";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchAllCampaigns();
        setCampaigns(all || []);
      } catch (err) {
        console.error("❌ Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading campaigns...</p>;
  }

  if (campaigns.length === 0) {
    return <p className="text-gray-600">No campaigns found.</p>;
  }

  return (
    <div className="space-y-6">
      {campaigns.map((c) => (
        <div
          key={c.id}
          className="border border-gray-300 rounded-xl p-6 shadow-md bg-white"
        >
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {c.name || "📢 Untitled Campaign"}
          </h2>

          {/* Optional description */}
          {c.description && (
            <p className="text-gray-700 mb-3">{c.description}</p>
          )}

          {/* ID */}
          <p className="text-xs text-gray-500 mb-3">ID: {c.id}</p>

          {/* Campaign info */}
          <div className="space-y-1">
            <p>🎯 Goal: <b>{c.goal} MIST</b></p>
            <p>📊 Raised: <b>{c.totalRaised} MIST</b></p>
            <p>📅 Deadline: <b>{new Date(Number(c.deadline)).toLocaleString()}</b></p>
            <p>👤 Owner: {c.owner}</p>
          </div>

          {/* Status */}
          <div className="mt-3">
            {Date.now() > Number(c.deadline) ? (
              <p className="text-red-600 font-semibold">⏰ Campaign ended</p>
            ) : (
              <p className="text-green-600 font-semibold">✅ Active</p>
            )}
          </div>

          {/* Contribute button */}
          <Link href={`/contribute?id=${c.id}`}>
            <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow">
              💸 Contribute
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}