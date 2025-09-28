import CampaignList from "../components/campaign/CampaignList";

export default function CampaignsPage() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-6">📢 All Campaigns</h1>
      <CampaignList />
    </main>
  );
}
