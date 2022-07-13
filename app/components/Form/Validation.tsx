import * as React from "react";

type ValidationType = {
  errors: string[];
  setError: (name: string) => void;
  removeError: (name: string) => void;
};

const ValidationContext = React.createContext<ValidationType>({
  errors: [],
  setError: () => {},
  removeError: () => {},
});

export const useValdation = () => React.useContext(ValidationContext);

interface ValidationProps {
  children: React.ReactNode;
}

export default function Validation({ children }: ValidationProps) {
  const [errors, setErrors] = React.useState<string[]>([]);
  console.log(errors);

  const setError = (name: string) =>
    setErrors((ers) => (!ers.includes(name) ? [...ers, name] : ers));
  const removeError = (name: string) =>
    setErrors((ers) => ers.filter((er) => er !== name));

  return (
    <ValidationContext.Provider value={{ errors, setError, removeError }}>
      {children}
    </ValidationContext.Provider>
  );
}
