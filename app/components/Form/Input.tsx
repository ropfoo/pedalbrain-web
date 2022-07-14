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
}

type InputError = {
  errorMessages?: string[];
};

export default function Input({
  name,
  label,
  error,
  defaultValue,
}: InputProps) {
  const [value, setValue] = React.useState("");
  const { state } = useTransition();

  const [inputError, setInputError] = React.useState<InputError | null>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setInputError(null);
  };

  const errorMessages = error?.errorMessages;

  React.useEffect(() => {
    if (errorMessages && state === "idle") {
      setInputError({ errorMessages: errorMessages });
    } else {
      setInputError(null);
    }
  }, [errorMessages, state]);

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
