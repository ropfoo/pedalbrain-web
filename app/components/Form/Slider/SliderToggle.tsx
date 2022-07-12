import * as React from "react";
import clsx from "clsx";
import { useOnOutsideClick } from "~/hooks/useOnOutsideClick";

interface SliderToggleProps {
  label?: string;
  value?: number;
  children: React.ReactNode;
}

export default function SliderToggle({
  children,
  value,
  label,
}: SliderToggleProps) {
  const toggleWrapperRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  useOnOutsideClick(toggleWrapperRef, () => setIsOpen(false));
  return (
    <div ref={toggleWrapperRef} className="relative">
      <button
        className={clsx(
          "flex rounded-md border-2 p-2 transition-all hover:border-blue",
          {
            "border-blue bg-blue": isOpen,
            "border-blue/30 bg-darkblue": !isOpen,
          }
        )}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
      >
        <p className="mr-3 font-bold text-lightblue">{label}</p>
        <p className="font-bold">{value}</p>
      </button>
      <div
        className={clsx(
          "absolute bottom-[-45px] z-10 flex h-10 w-[200px] flex-col justify-center rounded-md border-2  bg-darkblue transition-all duration-200 ease-in-out",
          {
            "pointer-events-none -translate-y-3 border-darkblue opacity-0":
              !isOpen,
            "translate-y-0 border-blue opacity-100": isOpen,
          }
        )}
      >
        {children}
      </div>
    </div>
  );
}
