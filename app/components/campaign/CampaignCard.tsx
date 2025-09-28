"use client";

import Link from "next/link";

export default function CampaignCard({ campaign }: { campaign: any }) {
  const {
    id,
    name,
    description,
    goal,
    raised,
    deadline,
    owner,
    isActive,
  } = campaign;

  console.log("✅ CampaignCard render:", name); // Para comprobar si entra aquí

  return (
    <div className="rounded-lg p-6 mb-6 text-black">
      {/* Nombre de la campaña */}
      <h2 className="text-2xl font-bold text-black">{name}</h2>
      <p className="mb-3 text-black">{description}</p>

      {/* Detalles */}
      <p className="text-sm break-words text-black">
        <strong>ID:</strong> {id}
      </p>
      <p className="text-black">🎯 Goal: {goal} MIST</p>
      <p className="text-black">📊 Raised: {raised} MIST</p>
      <p className="text-black">⏰ Deadline: {deadline}</p>
      <p className="break-words text-black">👤 Owner: {owner}</p>

      {/* Estado */}
      {isActive ? (
        <p className="text-green-600 font-semibold mt-2">✅ Active</p>
      ) : (
        <p className="text-red-600 font-semibold mt-2">❌ Inactive</p>
      )}

      {/* Botón */}
      <Link
        href={`/contribute?id=${id}&name=${encodeURIComponent(
          name
        )}&desc=${encodeURIComponent(description)}`}
      >
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold mt-4 py-2 rounded-lg">
          💸 Contribute
        </button>
      </Link>
    </div>
  );
}
