"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";
import StatsChart from "@/components/StatsChart";
import { doc, getDoc, deleteField, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StatsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser) return;

        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAlerts(userData.alerts || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleDeleteAlert = async (alertId) => {
    try {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedAlerts = userData.alerts.filter(
          (alert) => alert.id !== alertId
        );

        await updateDoc(userRef, {
          alerts: updatedAlerts,
        });

        setAlerts(updatedAlerts);
      }
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  return (
    <AuthCheck>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Your Statistics
            </h1>
            <p className="mt-2 text-gray-600">
              Monitor your API usage and manage your price alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StatsChart />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  Your Price Alerts
                </h3>

                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : alerts.length > 0 ? (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="bg-gray-50 p-3 rounded border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{alert.symbol}</p>
                            <p className="text-sm text-gray-600">
                              {alert.condition === "above" ? "Above" : "Below"}{" "}
                              ${alert.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Created on{" "}
                              {new Date(alert.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Delete alert"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">No price alerts set yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
