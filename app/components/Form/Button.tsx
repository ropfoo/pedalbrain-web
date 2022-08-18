import { useTransition } from "@remix-run/react";
import clsx from "clsx";

interface ButtonProps {
  children: string | number;
  onClick?: () => void;
  type?: "submit" | "button";
  name?: string;
  value?: string;
}

export default function Button({
  children,
  onClick,
  value,
  type = "button",
  name = "_action",
}: ButtonProps) {
  const transtition = useTransition();
  const isSubmitting = Boolean(transtition.submission);

  return (
    <button
      name={name}
      value={value}
      type={type}
      disabled={isSubmitting}
      onClick={onClick}
      className={clsx(
        "text-yellow-700 hover:bg-yellow-50 flex items-center justify-center rounded-md border border-transparent bg-blue px-4 py-3 text-base font-medium shadow-sm transition-colors sm:px-8",
        {
          "bg-pink": isSubmitting,
        }
      )}
    >
      {children}
    </button>
  );
}
