"use client";

type Campaign = {
  id: string;
  goal: string;
  deadline: string;
  totalRaised: string;
  owner: string;
};

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <div className="p-6 border rounded-lg shadow-md bg-white hover:shadow-lg transition">
      <h2 className="text-lg font-bold text-gray-800 mb-2">
        🎯 Campaign #{campaign.id.slice(0, 6)}...
      </h2>

      <p className="text-gray-700">
        <b>Goal:</b> {campaign.goal} SUI
      </p>
      <p className="text-gray-700">
        <b>Raised:</b> {campaign.totalRaised} SUI
      </p>
      <p className="text-gray-700">
        <b>Deadline:</b>{" "}
        {new Date(Number(campaign.deadline) * 1000).toLocaleString()}
      </p>
      <p className="text-gray-700">
        <b>Owner:</b> {campaign.owner}
      </p>

      <p className="text-xs text-gray-500 break-words mt-2">
        <b>ID:</b> {campaign.id}
      </p>

      <button
        onClick={() =>
          (window.location.href = `/contribute?id=${campaign.id}`)
        }
        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
      >
        💸 Contribute
      </button>
    </div>
  );
}
