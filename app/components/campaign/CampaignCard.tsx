"use client";

interface CampaignCardProps {
  id: string;
  goal: number;
  raised: number;
  deadline: number;
  owner: string;
}

export default function CampaignCard({ id, goal, raised, deadline, owner }: CampaignCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition">
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
        🎯 Campaign <span className="text-gray-500 text-sm truncate">{id}</span>
      </h3>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-semibold">Goal:</span>{" "}
          <span className="text-blue-600">{goal} SUI</span>
        </p>
        <p>
          <span className="font-semibold">Raised:</span>{" "}
          <span className="text-green-600">{raised} SUI</span>
        </p>
        <p>
          <span className="font-semibold">Deadline:</span>{" "}
          {new Date(Number(deadline) * 1000).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Owner:</span>{" "}
          <span className="truncate">{owner}</span>
        </p>
      </div>

      {/* Contribute Button */}
      <button
        className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                   text-white font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
        onClick={() => alert(`Contribute to ${id}`)}
      >
        💸 Contribute
      </button>
    </div>
  );
}
