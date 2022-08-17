import * as React from "react";
import clsx from "clsx";
import { useOnOutsideClick } from "~/hooks/useOnOutsideClick";

interface ContextMenuContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>> | (() => null);
}

const ContextMenuContext = React.createContext<ContextMenuContextType>({
  isOpen: false,
  setIsOpen: () => null,
});

interface ContextMenuProps {
  children: React.ReactNode;
}

export function ContextMenu({ children }: ContextMenuProps) {
  const toggleWrapperRef = React.useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = React.useState(false);
  useOnOutsideClick(toggleWrapperRef, () => setIsOpen(false));

  return (
    <ContextMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={toggleWrapperRef} className="relative w-fit">
        <button
          className={clsx(
            "flex rounded-md border-2 p-2 transition-all hover:border-blue",
            {
              "border-blue bg-blue": isOpen,
              "border-blue/30 bg-darkblue": !isOpen,
            }
          )}
          onClick={() => setIsOpen(true)}
        >
          open
        </button>
        <div
          className={clsx(
            "absolute top-12 z-10 flex w-[200px] flex-col justify-center rounded-md border-2  bg-darkblue transition-all duration-200 ease-in-out",
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
    </ContextMenuContext.Provider>
  );
}

interface ContextMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function ContextMenuItem({ onClick, children }: ContextMenuItemProps) {
  const { setIsOpen } = React.useContext(ContextMenuContext);

  const handleClick = () => {
    setIsOpen(false);
    if (onClick) onClick();
  };

  return (
    <button
      className="h-10 transition-colors hover:bg-blue"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
