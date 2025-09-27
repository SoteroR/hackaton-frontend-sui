"use client";

import { useEffect, useState } from "react";
import { fetchAllCampaigns } from "../../lib/fetchCampaigns";
import CampaignCard from "../campaign/CampaignCard";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((c) => (
        <CampaignCard
          key={c.id}
          goal={c.goal}
          raised={c.totalRaised}
          deadline={Number(c.deadline)}
          owner={c.owner}
          id={c.id}
        />
      ))}
    </div>
  );
}
