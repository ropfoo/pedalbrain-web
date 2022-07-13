import * as React from "react";

import clsx from "clsx";
import { z } from "zod";
import { useValdation } from "./Validation";

interface InputProps {
  label: string;
  name: string;
  error: {
    hasError: boolean;
    errorMessages?: string[];
  };
}

export default function Input({ name, label, error }: InputProps) {
  const [value, setValue] = React.useState("");
  const { setError, removeError } = useValdation();

  const testSchema = z.string().min(5);

  const [localError, setLocalError] = React.useState("");
  const { hasError, errorMessages } = error;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    const validateInput = testSchema.safeParse(event.target.value);

    // console.log(validateInput);

    if (!validateInput.success) {
      setError(name);
      setLocalError("there was an error maaaaan");
    } else {
      removeError(name);
      setLocalError("");
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor={name}>
        <p className=" font-bold text-lightblue">{label}</p>
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        // defaultValue={defaultValue}
        type="text"
        className={clsx("rounded-md border-2 bg-black py-1 px-2 text-white", {
          "border-pink": hasError,
          "border-lightblue": !hasError,
        })}
      />
      {localError && <p className="text-pink">{localError}</p>}
      {hasError &&
        errorMessages?.map((errorMessage) => (
          <p key={errorMessage} className="text-pink">
            {errorMessage}
          </p>
        ))}
    </div>
  );
}
