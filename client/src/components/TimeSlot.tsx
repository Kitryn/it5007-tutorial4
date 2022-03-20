import { Manifest, MAX_SEATS_PER_TRAIN } from "../models";
import { formatSummaryDatetime, getNumRemainingSeats } from "../util";

export default function Timeslot({
  train,
  activeManifestId,
  setActiveManifest,
}: {
  train: Manifest;
  activeManifestId: string | null;
  setActiveManifest: (manifest: string | null) => void;
}) {
  const bg = activeManifestId === train._id! ? "bg-slate-50" : "bg-slate-300";

  return (
    <div
      className={`${bg} m-1 mx-1.5 p-1 flex flex-col rounded-md shadow-lg hover:bg-slate-50 cursor-pointer`}
      onClick={() => setActiveManifest(train._id)}
    >
      <div className="text-left text-lg">{formatSummaryDatetime(train.date)}</div>
      <div className="text-left text-sm text-zinc-700">{getNumRemainingSeats(train)} / 25 seats remaining</div>
      <div className="w-full bg-gray-400 rounded-full h-1.5 mt-1.5">
        <div
          className="bg-blue-400 h-1.5 rounded-full"
          style={{ width: `${(train.seats.length / MAX_SEATS_PER_TRAIN) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
