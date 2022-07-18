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
  return (
    <button
      name={name}
      value={value}
      type={type}
      onClick={onClick}
      className={clsx(
        "text-yellow-700 hover:bg-yellow-50 flex items-center justify-center rounded-md border border-transparent bg-blue px-4 py-3 text-base font-medium shadow-sm sm:px-8"
      )}
    >
      {children}
    </button>
  );
}
