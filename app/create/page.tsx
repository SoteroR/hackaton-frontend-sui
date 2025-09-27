"use client";

import CreateCampaign from "../components/campaign/CreateCampaign";

export default function CreatePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create a New Campaign</h1>
      <CreateCampaign />
    </main>
  );
}
