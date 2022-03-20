import { useState } from "react";
import { Manifest, Reservation } from "../../models";
import { formatSummaryDatetime } from "../../util";

export default function ManifestPane({
  manifest,
  deleteTraveler,
}: {
  manifest: Manifest;
  deleteTraveler: (sn: number[]) => void;
}) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const toggleSelection = (i: number) => {
    const _set = new Set(selectedRows);
    if (_set.has(i)) {
      _set.delete(i);
    } else {
      _set.add(i);
    }
    setSelectedRows(_set);
  };

  const deleteTravelers = () => {
    deleteTraveler(Array.from(selectedRows.values()));
    setSelectedRows(new Set());
  };

  return (
    <div className="flex justify-center flex-col">
      <button className="bg-neutral-300 px-4 py-2 font-medium rounded-xl shadow mb-5" onClick={() => deleteTravelers()}>
        Delete Selected
      </button>
      <div className="flex flex-col">
        {manifest.seats
          .sort((a, b) => a.sn - b.sn)
          .map((s) => (
            <ManifestRow
              key={s.sn}
              reservation={s}
              isActive={selectedRows.has(s.sn)}
              toggleActive={() => toggleSelection(s.sn)}
            />
          ))}
      </div>
    </div>
  );
}

function ManifestRow({
  reservation,
  isActive,
  toggleActive,
}: {
  reservation: Reservation;
  isActive: boolean;
  toggleActive: () => void;
}) {
  const bg = isActive ? `bg-red-200` : `bg-blue-100`;

  return (
    <div className={`w-full ${bg} m-1 mt-2 p-2 rounded-xl shadow cursor-pointer flex flex-col`} onClick={toggleActive}>
      <div className="flex content-center">
        <div className="text-gray-600 text-lg">{reservation.name}</div>
        <div className="text-gray-600 text-sm ml-auto">
          <span className="text-slate-400">Booked at: </span>
          {formatSummaryDatetime(reservation.date!)}
        </div>
      </div>
      <div className="flex content-center">
        <div className="text-sm text-gray-500">
          Seat number: <span className="text-gray-600">{reservation.sn! + 1}</span>
        </div>
        <div className="ml-auto text-sm text-gray-600">
          <span className="text-slate-400">Tel: </span>
          {reservation.phone}
        </div>
      </div>
    </div>
  );
}
