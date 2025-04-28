"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 text-xl font-bold">
              Stock Tracker
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  href="/indices"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Indices
                </Link>
                {currentUser && (
                  <Link
                    href="/stats"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Stats
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {currentUser ? (
                <div className="flex items-center">
                  <span className="mr-4">{currentUser.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-600"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 ${isMenuOpen ? "hidden" : "block"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${isMenuOpen ? "block" : "hidden"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link
            href="/indices"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
          >
            Indices
          </Link>
          {currentUser && (
            <Link
              href="/stats"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Stats
            </Link>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          {currentUser ? (
            <div className="px-2 space-y-1">
              <span className="block px-3 py-2">{currentUser.email}</span>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 hover:bg-green-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
