import * as React from "react";
import { NavLink } from "@remix-run/react";
import clsx from "clsx";

export default function Navigation() {
  return (
    <nav className="fixed z-50 flex h-16 w-full items-center justify-between bg-darkblue px-16">
      <div>
        <NavLink to={"/"}>home</NavLink>
      </div>
      <div>
        <NavElement to="/pedals">pedals</NavElement>
      </div>
    </nav>
  );
}

interface NavElementProps {
  to: string;
  children: React.ReactNode;
}

function NavElement({ to }: NavElementProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        clsx(
          "text-lightblue transition-all duration-300 hover:brightness-125",
          {
            "text-pink": isActive,
          }
        )
      }
      to={to}
    >
      Pedals
    </NavLink>
  );
}
