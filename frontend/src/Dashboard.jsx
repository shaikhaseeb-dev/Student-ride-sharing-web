import { useEffect, useState } from "react";
import api from "./api";
import CreateRide from "./CreateRide";
import Navbar from "./Navbar";
import SeatSelector from "./SeatSelector";

export default function Dashboard() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const userEmail = localStorage.getItem("userEmail");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const loadRides = () => {
    setLoading(true);
    api
      .get("/rides")
      .then((res) => setRides(Array.isArray(res.data) ? res.data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRides();
  }, []);

  const bookRide = async (rideId, seats) => {
    await api.post(`/book/${rideId}`, { seats });
    loadRides();
  };

  const filteredRides = rides.filter((r) => {
    const pickup = (r.pickup || "").toLowerCase();
    const destination = (r.destination || "").toLowerCase();
    const q = query.toLowerCase();
    return pickup.includes(q) || destination.includes(q);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={logout} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Page Title */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          Available Rides
        </h2>

        {/* Search */}
        <input
          placeholder="Search by pickup or destination"
          className="w-full border border-gray-300 p-3 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-black"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Create Ride */}
        <div className="mb-8">
          <CreateRide onCreated={loadRides} />
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 bg-white border rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Ride Cards */}
        {!loading && (
          <div className="space-y-4">
            {filteredRides.length === 0 && (
              <p className="text-gray-500 text-center">
                No rides found.
              </p>
            )}

            {filteredRides.map((r) => {
              const isOwner = r.posted_by === userEmail;
              const role = isOwner ? "Ride Owner" : "Passenger";


              return (
                <div
                  key={r._id}
                  className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {r.pickup || "Unknown"} → {r.destination || "Unknown"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Time: {r.time || "--"}
                      </p>
                    </div>

                    <span className="text-xs px-3 py-1 rounded-full border text-gray-700">
                      {role}
                    </span>
                  </div>

                  {/* Seats */}
                  <div className="text-sm text-gray-700 mb-3">
                    Seats Available:{" "}
                    <span className="font-medium">{r.seats ?? 0}</span>
                  </div>

                  {/* Actions */}
                  {!isOwner && r.seats > 0 && (
                    <SeatSelector
                      maxSeats={r.seats}
                      onBook={(seats) => bookRide(r._id, seats)}
                    />
                  )}

                  {!isOwner && r.seats === 0 && (
                    <span className="text-gray-400 italic">
                      Fully Booked
                    </span>
                  )}

                  {isOwner && (
                    <span className="text-gray-400 italic">
                      Your ride
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
