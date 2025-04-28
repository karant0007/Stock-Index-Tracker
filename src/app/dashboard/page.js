"use client";

import { useState, useEffect } from "react";
import AuthCheck from "@/components/AuthCheck";
import IndexCard from "@/components/IndexCard";
import { getAvailableIndices } from "@/lib/finnhub";

export default function DashboardPage() {
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    // In a real app, this might be an API call
    const availableIndices = getAvailableIndices();
    setIndices(availableIndices);
  }, []);

  return (
    <AuthCheck>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome to your Stock Index Tracker dashboard. Monitor performance
              and set alerts for your favorite indices.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Popular Indices</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {indices.map((index) => (
                <IndexCard key={index.symbol} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
