import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        {/* Hero Section */}
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to <span className="text-indigo-600">Blockchain Crowdfunder</span> 🎉
        </h1>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto mb-10 leading-relaxed">
          A transparent and fair crowdfunding platform built on{" "}
          <span className="font-semibold text-indigo-600">SUI Blockchain</span>.  
          No middlemen, no hidden fees — just code you can trust.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-2 text-gray-900">🔍 Transparent</h3>
            <p className="text-sm text-gray-800">
              Every transaction is on-chain and fully auditable.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-2 text-gray-900">💸 Fair</h3>
            <p className="text-sm text-gray-800">
              Only 2% platform fee when funding goal is reached.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-2 text-gray-900">🎁 NFT Rewards</h3>
            <p className="text-sm text-gray-800">
              Every contribution instantly mints a digital NFT badge.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <Link
          href="/campaigns"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md transition"
        >
          🚀 Explore Campaigns
        </Link>

        {/* Footer */}
        <p className="mt-12 text-sm text-gray-700">
          Built with ❤️ for the{" "}
          <span className="font-semibold text-indigo-600">SUI Hackathon</span>.
        </p>
      </div>
    </div>
  );
}
