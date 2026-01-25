import { useState } from "react";

export default function Navbar({ onLogout }) {
  const [open, setOpen] = useState(false);
  const userEmail = localStorage.getItem("userEmail") || "";
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* App Name */}
        <h1 className="text-xl font-semibold text-blue-600">
          Student Ride Sharing
        </h1>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold focus:outline-none"
            title={userEmail}
          >
            {initial}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-2 text-sm text-gray-600 border-b">
                {userEmail}
              </div>

              <a
                href="/dashboard"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Dashboard
              </a>

              <a
                href="/my-rides"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                My Rides
              </a>

              <a
                href="/bookings"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                My Bookings
              </a>

              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
