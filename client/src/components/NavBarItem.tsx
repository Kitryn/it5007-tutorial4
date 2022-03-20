import { ReactElement } from "react";

export default function NavBarItem({
  children,
  onclick = () => {},
  hasDropdown = false,
}: {
  children: string | ReactElement[];
  onclick?: () => void;
  hasDropdown?: boolean;
}) {
  const parentClassName = `p-1 last:ml-auto align-middle justify-center text-center m-1 cursor-pointer text-lg ${
    hasDropdown ? "has-dropdown" : ""
  }`;

  return (
    <div onClick={onclick} className={parentClassName}>
      {children}
    </div>
  );
}
