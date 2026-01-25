import { useEffect, useState } from "react";
import api from "./api";
import Navbar from "./Navbar";

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const user = localStorage.getItem("userEmail");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    api.get("/rides")
      .then((res) => {
        const mine = res.data.filter(
          (r) => r.posted_by === user
        );
        setRides(mine);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={logout} />

      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">
          My Rides (Driver)
        </h2>

        {rides.length === 0 && (
          <p className="text-gray-600">
            You haven’t created any rides yet.
          </p>
        )}

        <div className="space-y-4">
          {rides.map((r) => (
            <div
              key={r._id}
              className="bg-white p-4 rounded shadow"
            >
              <div className="font-semibold">
                {r.pickup} → {r.destination}
              </div>
              <div className="text-sm text-gray-600">
                Time: {r.time}
              </div>
              <div className="text-sm">
                Seats left: {r.seats}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
