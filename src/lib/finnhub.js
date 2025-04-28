import { db } from "./firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

// Track API usage
const incrementApiUsage = async (userId) => {
  if (!userId) return;

  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      apiCalls: increment(1),
    });
  } catch (error) {
    console.error("Error updating API usage count:", error);
  }
};

// Get stock quote
export const getStockQuote = async (symbol, userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    await incrementApiUsage(userId);
    return await response.json();
  } catch (error) {
    console.error("Error fetching stock quote:", error);
    throw error;
  }
};

// Get stock candles (historical data)
export const getStockCandles = async (symbol, resolution, from, to, userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    await incrementApiUsage(userId);
    return await response.json();
  } catch (error) {
    console.error("Error fetching stock candles:", error);
    throw error;
  }
};

// Get company profile
export const getCompanyProfile = async (symbol, userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    await incrementApiUsage(userId);
    return await response.json();
  } catch (error) {
    console.error("Error fetching company profile:", error);
    throw error;
  }
};

// Get available stock indices (Example indices - in a real app, you'd get this from API)
export const getAvailableIndices = () => {
  return [
    {
      symbol: "GSPC",
      name: "S&P 500",
      description: "Standard & Poor's 500 Index",
    },
    {
      symbol: "DJI",
      name: "Dow Jones Industrial Average",
      description: "Dow Jones Industrial Average Index",
    },
    {
      symbol: "IXIC",
      name: "NASDAQ Composite",
      description: "NASDAQ Composite Index",
    },
    {
      symbol: "FTSE",
      name: "FTSE 100",
      description: "Financial Times Stock Exchange 100 Index",
    },
    { symbol: "N225", name: "Nikkei 225", description: "Nikkei 225 Index" },
    { symbol: "AAPL", name: "Apple Inc", description: "Apple Inc" },
    { symbol: "BTC", name: "BTC-USD", description: "BTC-USD" },
    { symbol: "ETH", name: "ETH-USD", description: "ETH-USD" },
  ];
};
