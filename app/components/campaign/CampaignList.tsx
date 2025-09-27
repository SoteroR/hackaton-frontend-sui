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
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            📢 Campaign {c.id.slice(0, 6)}...  {/* ✅ show ID at top */}
          </h2>
          <p className="text-sm text-gray-500 mb-2">ID: {c.id}</p> {/* ✅ full ID */}

          <p>🎯 Goal: {c.goal} SUI</p>
          <p>📊 Raised: {c.totalRaised} SUI</p>
          <p>📅 Deadline: {new Date(c.deadline * 1000).toLocaleString()}</p>
          <p>👤 Owner: {c.owner}</p>

          {c.name && <p className="mt-2 font-semibold">📝 {c.name}</p>}
          {c.description && <p className="text-gray-700">{c.description}</p>}

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
