"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getStockQuote } from "@/lib/finnhub";
// import { useRouter } from "next/navigation";

export default function IndexCard({ index }) {
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  // const router = useRouter();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = await getStockQuote(index.symbol, currentUser?.uid);
        setQuoteData(data);
      } catch (error) {
        console.error(`Error fetching quote for ${index.symbol}:`, error);
      } finally {
        setLoading(false);
      }
    };
    debugger;
    console.log(`currentUser : ${currentUser}`);
    if (currentUser) {
      fetchQuote();
    }
  }, [index.symbol, currentUser]);

  const getChangeColor = () => {
    if (!quoteData) return "text-gray-500";
    return quoteData.dp > 0
      ? "text-green-500"
      : quoteData.dp < 0
      ? "text-red-500"
      : "text-gray-500";
  };

  return (
    <Link href={{ pathname: `/indices/symbol`, query: { id: index.symbol } }}>
      {/* <button
        className="bg-amber-50 text-blue-600 border border-blue-600"
        onClick={() => {
          router.push(`/indices/symbol/${index.symbol}`);
        }}
      >
        info
      </button> */}
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{index.name}</h3>
            <p className="text-gray-500 text-sm">{index.symbol}</p>
          </div>

          {loading ? (
            <div className="animate-pulse h-6 w-16 bg-gray-200 rounded"></div>
          ) : quoteData ? (
            <div className="text-right">
              <p className="text-lg font-bold">${quoteData?.c?.toFixed(2)}</p>
              <p className={`text-sm ${getChangeColor()}`}>
                {quoteData.d > 0 && "+"}
                {quoteData.d?.toFixed(2)} ({quoteData.dp > 0 && "+"}
                {quoteData.dp?.toFixed(2)}%)
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data</p>
          )}
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {index.description}
        </p>
      </div>
    </Link>
  );
}
