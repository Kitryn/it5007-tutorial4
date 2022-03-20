import { Manifest } from "../models";
import Timeslot from "./TimeSlot";

export default function SideBar({
  trains,
  activeManifestId,
  setActiveManifest,
}: {
  trains: Manifest[];
  activeManifestId: string | null;
  setActiveManifest: (manifestId: string | null) => void;
}) {
  return (
    <div className="relative top-0 left-0 w-72 min-w-max bg-slate-400 flex flex-col shadow-lg overflow-y-scroll min-h-full">
      <div className="text-left p-2 font-bold text-lg">Upcoming Trains</div>
      {trains.map((t) => (
        <Timeslot key={t._id} train={t} activeManifestId={activeManifestId} setActiveManifest={setActiveManifest} />
      ))}
    </div>
  );
}
