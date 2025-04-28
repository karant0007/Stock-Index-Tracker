"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function StatsChart() {
  const [apiUsageData, setApiUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchApiUsage = async () => {
      try {
        if (!currentUser) return;

        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const apiCalls = userData.apiCalls || 0;

          // For a more comprehensive chart, we would typically fetch usage over time
          // But for this example, we'll create some demo data
          const mockData = [
            { name: "Today", calls: apiCalls },
            { name: "Limit", calls: 100 }, // Assuming a limit of 100 calls for demo
          ];

          setApiUsageData(mockData);
        }
      } catch (err) {
        console.error("Error fetching API usage:", err);
        setError("Failed to load API usage data");
      } finally {
        setLoading(false);
      }
    };

    fetchApiUsage();
  }, [currentUser]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">API Usage Statistics</h3>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : apiUsageData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={apiUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calls" fill="#3B82F6" name="API Calls" />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-4 text-sm text-gray-600">
            You have made {apiUsageData[0]?.calls || 0} API calls out of your
            limit of 100.
          </p>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No API usage data available</p>
        </div>
      )}
    </div>
  );
}
