"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";
import IndexChart from "@/components/IndexChart";
import AlertForm from "@/components/AlertForm";
import {
  getStockQuote,
  getCompanyProfile,
  getAvailableIndices,
} from "@/lib/finnhub";

export default function IndexDetailPage() {
  debugger;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const symbol = searchParams.get("id");
  const [quote, setQuote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  useEffect(() => {
    const fetchIndexData = async () => {
      try {
        debugger;
        setLoading(true);

        // Get basic info about the index
        const indices = getAvailableIndices();
        const currentIndex = indices.find((idx) => idx.symbol === symbol);
        debugger;

        if (!currentIndex) {
          throw new Error("Index not found");
        }

        // Fetch current quote
        const quoteData = await getStockQuote(symbol, currentUser?.uid);
        setQuote(quoteData);

        // Fetch company/index profile if available
        try {
          debugger;
          const profileData = await getCompanyProfile(symbol, currentUser?.uid);
          setProfile(profileData);
        } catch (profileError) {
          console.error(
            "Error fetching profile, this is expected for some indices:",
            profileError
          );
          setProfile({
            name: currentIndex.name,
            description: currentIndex.description,
          });
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching index data:", err);
        setError("Failed to load index data");
      } finally {
        setLoading(false);
      }
    };
    debugger;
    if (symbol && currentUser) {
      fetchIndexData();
    }
  }, [symbol, currentUser]);

  const getChangeColor = () => {
    if (!quote) return "text-gray-500";
    return quote.dp > 0
      ? "text-green-500"
      : quote.dp < 0
      ? "text-red-500"
      : "text-gray-500";
  };

  return (
    <AuthCheck>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">
                  {profile.name || symbol}
                </h1>
                <p className="text-gray-500">{symbol}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      ${quote?.c?.toFixed(2) || "N/A"}
                    </h2>
                    <p className={`text-sm ${getChangeColor()}`}>
                      {quote?.d > 0 && "+"}
                      {quote?.d?.toFixed(2) || "N/A"} ({quote?.dp > 0 && "+"}
                      {quote?.dp?.toFixed(2) || "N/A"}%)
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-0 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Open</p>
                      <p className="font-medium">
                        ${quote?.o?.toFixed(2) || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">High</p>
                      <p className="font-medium">
                        ${quote?.h?.toFixed(2) || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Low</p>
                      <p className="font-medium">
                        ${quote?.l?.toFixed(2) || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prev. Close</p>
                      <p className="font-medium">
                        ${quote?.pc?.toFixed(2) || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {profile?.description || "No description available."}
                </p>

                <IndexChart symbol={symbol} />

                <AlertForm symbol={symbol} currentPrice={quote?.c} />
              </div>
            </>
          )}
        </div>
      </div>
    </AuthCheck>
  );
}
