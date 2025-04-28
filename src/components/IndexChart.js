"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStockCandles } from "@/lib/finnhub";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function IndexChart({ symbol }) {
  debugger;
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("1d"); // Default to 1 day
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        // Calculate time range
        const to = Math.floor(Date.now() / 1000);
        let from;
        let resolution;

        switch (timeRange) {
          case "1d":
            from = to - 24 * 60 * 60; // 1 day ago
            resolution = "5"; // 5 minute intervals
            break;
          case "1w":
            from = to - 7 * 24 * 60 * 60; // 1 week ago
            resolution = "60"; // 1 hour intervals
            break;
          case "1m":
            from = to - 30 * 24 * 60 * 60; // 1 month ago
            resolution = "D"; // Daily intervals
            break;
          case "3m":
            from = to - 90 * 24 * 60 * 60; // 3 months ago
            resolution = "D"; // Daily intervals
            break;
          case "1y":
            from = to - 365 * 24 * 60 * 60; // 1 year ago
            resolution = "W"; // Weekly intervals
            break;
          default:
            from = to - 24 * 60 * 60; // Default to 1 day
            resolution = "5"; // 5 minute intervals
        }

        const data = await getStockCandles(
          symbol,
          resolution,
          from,
          to,
          currentUser?.uid
        );

        if (data.s === "ok" && data.t && data.t.length > 0) {
          // Format data for Recharts
          const formattedData = data.t.map((timestamp, index) => ({
            time: new Date(timestamp * 1000).toLocaleString(),
            price: data.c[index], // Closing price
            open: data.o[index],
            high: data.h[index],
            low: data.l[index],
          }));

          setChartData(formattedData);
          setError(null);
        } else {
          setError("No data available for the selected timeframe");
          setChartData([]);
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    if (symbol && currentUser) {
      fetchChartData();
    }
  }, [symbol, timeRange, currentUser]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">{symbol} Price Chart</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTimeRangeChange("1d")}
            className={`px-3 py-1 rounded ${
              timeRange === "1d" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            1D
          </button>
          <button
            onClick={() => handleTimeRangeChange("1w")}
            className={`px-3 py-1 rounded ${
              timeRange === "1w" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            1W
          </button>
          <button
            onClick={() => handleTimeRangeChange("1m")}
            className={`px-3 py-1 rounded ${
              timeRange === "1m" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            1M
          </button>
          <button
            onClick={() => handleTimeRangeChange("3m")}
            className={`px-3 py-1 rounded ${
              timeRange === "3m" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            3M
          </button>
          <button
            onClick={() => handleTimeRangeChange("1y")}
            className={`px-3 py-1 rounded ${
              timeRange === "1y" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            1Y
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="h-64">
          {chartData.length > 0 ? (
            <div style={{ width: "100%", height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      if (timeRange === "1d") {
                        return date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      } else {
                        return date.toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        });
                      }
                    }}
                  />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#2563eb"
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No chart data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
