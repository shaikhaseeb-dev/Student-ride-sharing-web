import { useState } from "react";
import api from "./api";

export default function CreateRide({ onCreated }) {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState(1);

  const submitRide = async () => {
    if (!pickup || !destination || !time) {
      alert("Fill all fields");
      return;
    }

    await api.post("/rides", {
      pickup,
      destination,
      time,
      seats: Number(seats),
    });

    setPickup("");
    setDestination("");
    setTime("");
    setSeats(1);
    onCreated();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">
        Create Ride
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Pickup"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <input
          type="time"
          className="border p-2 rounded"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <input
          type="number"
          min="1"
          className="border p-2 rounded"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />
      </div>

      <button
        onClick={submitRide}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Create Ride
      </button>
    </div>
  );
}
