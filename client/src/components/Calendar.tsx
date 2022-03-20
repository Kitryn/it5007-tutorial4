import { Manifest, MAX_SEATS_PER_TRAIN } from "../models";
import { DAYS, getNumRemainingSeats } from "../util";

export default function Calendar({
  month,
  year,
  manifests,
  setActiveManifest,
}: {
  month: number;
  year: number;
  manifests: Manifest[];
  setActiveManifest: (manifestId: string | null) => void;
}) {
  const firstDay = new Date(year, month).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const emptyEndDays = 7 * 6 - firstDay - daysInMonth;

  const cellDates = [
    ...Array(firstDay).fill(null),
    ...Array(daysInMonth)
      .fill(null)
      .map((_, i) => i + 1),
    ...Array(emptyEndDays).fill(null),
  ];
  const manifestsThisMonthByDate = manifests
    .map((m, i) => {
      return { m, i };
    })
    .filter(({ m }) => m.date.getMonth() === month)
    .reduce((acc: Record<number, { m: Manifest; i: number }>, { m, i }) => {
      const _d = m.date.getDate();
      acc[_d] = { m, i };
      return acc;
    }, {});

  return (
    <div className="grid grid-cols-[repeat(7,_minmax(4rem,_1fr))] grid-rows-6 gap-1 bg-zinc-200 border-zinc-200 border-4 m-2 min-w-fit">
      {DAYS.map((d) => (
        <p key={d} className="text-center bg-slate-50 p-1 rounded-sm">
          {d}
        </p>
      ))}
      {cellDates.map((d, i) => {
        const { m } = manifestsThisMonthByDate[d] ?? {};

        return <CalendarCell key={i} date={d} manifest={m ?? null} setActiveManifest={setActiveManifest} />;
      })}
    </div>
  );
}

function CalendarCell({
  date,
  manifest,
  setActiveManifest,
}: {
  date: number | null;
  manifest: Manifest | null;
  setActiveManifest: (manifestId: string | null) => void;
}) {
  const setManifest = () => {
    if (manifest?._id != null) setActiveManifest(manifest._id);
  };

  const cellClass = (() => {
    if (manifest == null) return "";
    const bg = getNumRemainingSeats(manifest) / MAX_SEATS_PER_TRAIN < 0.2 ? "bg-red-200" : "bg-green-200";
    return `cursor-pointer ${bg}`;
  })();

  return (
    <div
      className={`p-1 pl-1.5 rounded-sm h-20 ${manifest?._id != null ? cellClass : "bg-slate-50"}`}
      onClick={setManifest}
    >
      <div className="absolute">{date}</div>
      {manifest != null ? (
        <div className="container">
          <div className="text-sm p-1 text-center mt-1.5">{manifest.date.toLocaleTimeString("en-US")}</div>
          <div className="p-1 text-base text-center font-bold text-zinc-700">
            {getNumRemainingSeats(manifest)} / {MAX_SEATS_PER_TRAIN}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
