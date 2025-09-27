"use client";

import CampaignList from "../components/campaign/CampaignList";

export default function CampaignsPage() {
  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">📋 All Campaigns</h1>
      <CampaignList />
    </main>
  );
}
