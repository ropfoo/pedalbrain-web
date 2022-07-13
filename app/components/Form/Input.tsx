import clsx from "clsx";

interface InputProps {
  label: string;
  name: string;
  defaultValue?: string | number;
  error: {
    hasError: boolean;
    errorMessages?: string[];
  };
}

export default function Input({
  name,
  label,
  defaultValue,
  error,
}: InputProps) {
  const { hasError, errorMessages } = error;
  return (
    <div className="mb-3">
      <label htmlFor={name}>
        <p className=" font-bold text-lightblue">{label}</p>
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        type="text"
        className={clsx("rounded-md border-2 bg-black py-1 px-2 text-white", {
          "border-pink": hasError,
          "border-lightblue": !hasError,
        })}
      />
      {hasError &&
        errorMessages?.map((errorMessage) => (
          <p key={errorMessage} className="text-pink">
            {errorMessage}
          </p>
        ))}
    </div>
  );
}
