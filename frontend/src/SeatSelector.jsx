import { useState } from "react";

export default function SeatSelector({ maxSeats, onBook }) {
  const [seats, setSeats] = useState(1);

  return (
    <div className="flex items-center gap-2 mt-2">
      <select
        value={seats}
        onChange={(e) => setSeats(Number(e.target.value))}
        className="border rounded p-1"
      >
        {Array.from({ length: maxSeats }, (_, i) => i + 1).map(
          (n) => (
            <option key={n} value={n}>
              {n} seat{n > 1 ? "s" : ""}
            </option>
          )
        )}
      </select>

      <button
        onClick={() => onBook(seats)}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Book
      </button>
    </div>
  );
}
