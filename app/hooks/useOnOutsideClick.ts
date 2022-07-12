import * as React from "react";

export function useOnOutsideClick(
  ref: React.RefObject<HTMLElement>,
  onOutsideClick: () => void
) {
  React.useEffect(() => {
    const handleOutsideClickEvent = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener("click", handleOutsideClickEvent);

    return () => document.removeEventListener("click", handleOutsideClickEvent);
  }, []);
}
