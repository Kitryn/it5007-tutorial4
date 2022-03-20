import { ReactElement } from "react";

export default function NavBar({ children }: { children: ReactElement[] }) {
  return <div className="flex w-full h-11 bg-slate-600 text-gray-50 items-center shadow">{children}</div>;
}
