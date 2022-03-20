import { Manifest } from "../models";
import { MONTH_NAMES } from "../util";
import Calendar from "./Calendar";

export default function CalendarContainer({
  manifests,
  setActiveManifest,
}: {
  manifests: Manifest[];
  setActiveManifest: (manifestId: string | null) => void;
}) {
  const [_, initialMonth, initialYear] = manifests
    .map((m) => {
      const d = m.date;
      return [d.getDate(), d.getMonth(), d.getFullYear()];
    })
    .reduce(
      (acc: number[][], [date, month, year]) => {
        acc[0].push(date);
        acc[1].push(month);
        acc[2].push(year);
        return acc;
      },
      [[], [], []],
    )
    .map((arr) => {
      return Math.min(...arr);
    });

  // TODO: scroll back and forth in calendar
  // TODO: loading screen
  if (manifests.length === 0) {
    return <></>;
  }

  return (
    <div className="bg-slate-200 w-full min-h-fit h-full flex justify-center">
      <div className="bg-slate-50 w-11/12 my-10 rounded-lg min-w-fit h-fit">
        <div className="text-center p-5 uppercase font-bold text-xl text-gray-700">{MONTH_NAMES[initialMonth]}</div>
        <Calendar month={initialMonth} year={initialYear} manifests={manifests} setActiveManifest={setActiveManifest} />
      </div>
    </div>
  );
}
