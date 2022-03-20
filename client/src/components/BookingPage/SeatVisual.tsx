import { Manifest, MAX_SEATS_PER_TRAIN } from "../../models";
import { ReactComponent as Seat } from "./seat.svg";

export default function SeatVisual({
  manifest,
  selectedSeat,
  setSelectedSeat,
}: {
  manifest: Manifest;
  selectedSeat: number | null;
  setSelectedSeat: (index: number | null) => void;
}) {
  const occupiedSeats = new Set(manifest.seats.map((s) => s.sn));

  return (
    <div className="bg-slate-200 h-full flex justify-center">
      <div className="flex flex-wrap justify-center w-4/5 content-center h-fit bg-zinc-50 m-2 mt-10 p-2 rounded-xl shadow py-10">
        {Array(MAX_SEATS_PER_TRAIN)
          .fill(null)
          .map((_, i) => {
            return (
              <Seat
                key={i}
                className={`${
                  occupiedSeats.has(i) ? "bg-red-200" : i === selectedSeat ? "bg-green-200" : ""
                } cell last:mr-auto shadow-md rounded-md`}
                onClick={() => setSelectedSeat(i)}
              />
            );
          })}
      </div>
    </div>
  );
}
