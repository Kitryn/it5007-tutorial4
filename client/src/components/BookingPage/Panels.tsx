import { useState } from "react";
import { Manifest, Reservation } from "../../models";
import AddTravelerPane from "./AddTravelerPane";
import ManifestPane from "./ManifestPane";

export default function Panels({
  manifest,
  addTraveler,
  deleteTraveler,
  selectedSeat,
}: {
  manifest: Manifest;
  addTraveler: (r?: Omit<Reservation, "date">) => Promise<boolean>;
  deleteTraveler: (sn: number[]) => void;
  selectedSeat: number | null;
}) {
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);

  const panels = ["Manifest", "Add Traveler"];
  const panelComponents = [
    <ManifestPane manifest={manifest} deleteTraveler={deleteTraveler} />,
    <AddTravelerPane addTraveler={addTraveler} selectedSeat={selectedSeat} />,
  ];

  return (
    <div className="bg-slate-50 w-5/6 -ml-5 min-w-fit min-h-[calc(100% - 2.5rem)] mt-10 rounded-xl flex flex-col">
      <div className="flex justify-center content-center">
        {panels.map((s, i) => {
          const bg = `${i === activePanelIndex ? "bg-blue-200" : "bg-neutral-200"}`;
          return (
            <div
              key={i}
              className={`grow text-center m-1 mt-2 p-2 rounded-sm  
            first:ml-2 last:mr-2 cursor-pointer transition-colors ${bg}`}
              onClick={() => {
                setActivePanelIndex(i);
              }}
            >
              {s}
            </div>
          );
        })}
      </div>
      <div className="m-2 py-1 px-2">{panelComponents[activePanelIndex]}</div>
    </div>
  );
}
