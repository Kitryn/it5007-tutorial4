import { Manifest } from "@it5007-tutorial4/server";
import { useState } from "react";
import { formatSummaryDatetime } from "../../util";

export default function BlacklistPane({
  blacklist,
  deleteNameFromBlacklist,
}: {
  blacklist: string;
  deleteNameFromBlacklist: (name: string) => Promise<void>;
}) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleSelection = (name: string) => {
    const _set = new Set(selectedRows);
    if (_set.has(name)) {
      _set.delete(name);
    } else {
      _set.add(name);
    }
    setSelectedRows(_set);
  };

  const deleteTravelers = () => {
    if (Array.from(selectedRows).length === 0) return;
    deleteNameFromBlacklist(Array.from(selectedRows)[0]); // Ran out of time to implement this
    setSelectedRows(new Set());
  };

  return (
    <div className="flex justify-center flex-col">
      <button className="bg-neutral-300 px-4 py-2 font-medium rounded-xl shadow mb-5" onClick={() => deleteTravelers()}>
        Delete Selected
      </button>
      <div className="flex flex-col">
        {Array.from(blacklist).map((n, i) => {
          return (
            <ManifestRow key={n} name={n} isActive={selectedRows.has(n)} toggleActive={() => toggleSelection(n)} />
          );
        })}
      </div>
    </div>
  );
}

function ManifestRow({ name, isActive, toggleActive }: { name: string; isActive: boolean; toggleActive: () => void }) {
  const bg = isActive ? `bg-red-200` : `bg-blue-100`;

  return (
    <div className={`w-full ${bg} m-1 mt-2 p-2 rounded-xl shadow cursor-pointer flex flex-col`} onClick={toggleActive}>
      <div className="flex content-center">
        <div className="text-gray-600 text-lg">{name}</div>
      </div>
    </div>
  );
}
