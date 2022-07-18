import * as React from "react";

import clsx from "clsx";
import { z } from "zod";
import { useValdation } from "./Validation";
import { useTransition } from "@remix-run/react";

interface InputProps {
  label: string;
  name: string;
  error?: InputError;
  defaultValue?: string;
  onChange?: (input: string) => void;
}

type InputError = {
  errorMessages?: string[];
};

export default function Input({
  name,
  label,
  error,
  defaultValue,
  onChange,
}: InputProps) {
  const [value, setValue] = React.useState(defaultValue);
  const { state } = useTransition();

  const { checkError } = useValdation();

  const [inputError, setInputError] = React.useState<InputError | null>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setInputError(null);
    if (onChange) onChange(event.target.value);
    const test = checkError(name, event.target.value);
  };

  const errorMessages = error?.errorMessages;

  React.useEffect(() => {
    if (errorMessages && state === "idle") {
      setInputError({ errorMessages: errorMessages });
    } else {
      setInputError(null);
    }
  }, [errorMessages, state]);

  React.useEffect(() => setValue(defaultValue), [defaultValue]);

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
        defaultValue={defaultValue}
        type="text"
        className={clsx("rounded-md border-2 bg-black py-1 px-2 text-white", {
          "border-pink": inputError,
          "border-lightblue": !inputError,
        })}
      />
      {inputError &&
        inputError.errorMessages?.map((errorMessage) => (
          <p key={errorMessage} className="text-pink">
            {errorMessage}
          </p>
        ))}
    </div>
  );
}
