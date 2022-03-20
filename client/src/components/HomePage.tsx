import { Manifest } from "../models";
import CalendarContainer from "./CalendarContainer";
import Header from "./Header";
import Info from "./Info";

export default function HomePage({
  allManifests,
  setActiveManifest,
}: {
  allManifests: Manifest[];
  setActiveManifest: (manifestId: string | null) => void;
}) {
  // return <>this is the home page with {allManifests.length} trains</>;
  return (
    <div className="flex flex-col items-center w-full h-full">
      <Header />
      <Info />
      <CalendarContainer manifests={allManifests} setActiveManifest={setActiveManifest} />
    </div>
  );
}
