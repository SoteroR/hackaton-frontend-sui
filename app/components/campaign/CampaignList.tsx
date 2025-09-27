"use client";

import { useEffect, useState } from "react";
import { fetchAllCampaigns } from "../../lib/fetchAllCampaigns";
import Link from "next/link";

type Campaign = {
  id: string;
  goal: number;
  deadline: number;
  totalRaised: number;
  owner: string;
  isActive: boolean;
};

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchAllCampaigns();
        setCampaigns(all);
      } catch (err) {
        console.error("❌ Failed to fetch campaigns", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-gray-600">⏳ Loading campaigns...</p>;
  }

  if (campaigns.length === 0) {
    return <p className="text-gray-600">No campaigns found yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {campaigns.map((c) => (
        <div
          key={c.id}
          className="p-4 border rounded-lg shadow bg-white flex flex-col gap-2"
        >
          <h2 className="text-lg font-bold text-gray-800">
            📢 Campaign {c.id.slice(0, 6)}...
          </h2>
          <p className="text-gray-800">🎯 Goal: {c.goal} SUI</p>
          <p className="text-gray-800">📊 Raised: {c.totalRaised} SUI</p>
          <p className="text-gray-800">
            📅 Deadline: {new Date(Number(c.deadline) * 1000).toLocaleString()}
          </p>
          <p className="text-gray-800">👤 Owner: {c.owner.slice(0, 10)}...</p>

          {/* ✅ Button with white text */}
          <Link href={`/contribute?id=${c.id}`}>
            <button className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition">
              💸 Contribute
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}
