"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AlertForm({ symbol, currentPrice }) {
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("above");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    debugger;
    console.log("Hello alert" + currentUser);
    if (!currentUser) {
      setMessage({
        text: "You must be logged in to set alerts",
        type: "error",
      });
      return;
    }

    if (!price || isNaN(price) || Number(price) <= 0) {
      setMessage({ text: "Please enter a valid price", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const alertId = Date.now().toString();
      const newAlert = {
        id: alertId,
        symbol,
        price: Number(price),
        condition,
        createdAt: new Date().toISOString(),
        active: true,
      };

      // Add alert to user's document
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        alerts: arrayUnion(newAlert),
      });

      setPrice("");
      setMessage({
        text: `Alert set for ${symbol} ${condition} $${price}`,
        type: "success",
      });
    } catch (error) {
      console.error("Error setting alert:", error);
      setMessage({
        text: "Failed to set alert. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Set Price Alert</h3>

      {message.text && (
        <div
          className={`p-3 rounded mb-4 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Price: ${currentPrice ? currentPrice.toFixed(2) : "N/A"}
            </label>
            <div className="flex items-center">
              <span className="bg-gray-200 py-2 px-3 rounded-l-md">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Alert price"
                step="0.01"
                min="0"
                className="flex-1 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="above">Price is above</option>
              <option value="below">Price is below</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !currentUser}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Setting Alert..." : "Set Alert"}
        </button>

        {!currentUser && (
          <p className="mt-2 text-sm text-red-500">
            You must be logged in to set alerts
          </p>
        )}
      </form>
    </div>
  );
}
