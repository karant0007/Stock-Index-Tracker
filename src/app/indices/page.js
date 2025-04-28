"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";
import IndexCard from "@/components/IndexCard";
import { getAvailableIndices } from "@/lib/finnhub";

export default function IndicesPage() {
  const [indices, setIndices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const availableIndices = getAvailableIndices();
    setIndices(availableIndices);
  }, []);

  const filteredIndices = indices.filter(
    (index) =>
      index.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      index.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthCheck>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Stock Indices
            </h1>
            <p className="mt-2 text-gray-600">
              Browse and track major stock indices from around the world.
            </p>
          </div>

          <div className="mb-6">
            <div className="max-w-md">
              <label htmlFor="search" className="sr-only">
                Search indices
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search indices"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIndices.length > 0 ? (
              filteredIndices.map((index) => (
                <IndexCard key={index.symbol} index={index} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">
                  No indices found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
