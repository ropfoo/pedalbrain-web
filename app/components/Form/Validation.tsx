import * as React from "react";

type ValidationTodo = {
  name: string;
  resolved: boolean;
  validation: (input: string) => boolean;
};

type ValidationError = {
  name: string;
  todos: ValidationTodo[];
};

type ValidationType = {
  errors: string[];
  setError: (name: string) => void;
  removeError: (name: string) => void;
  checkError: (name: string, input: string) => ValidationTodo[];
};

const ValidationContext = React.createContext<ValidationType>({
  errors: [],
  setError: () => {},
  removeError: () => {},
  checkError: () => [],
});

export const useValdation = () => React.useContext(ValidationContext);

interface ValidationProps {
  children: React.ReactNode;
  schema: ValidationError[];
}

export default function Validation({ children, schema }: ValidationProps) {
  const [errors, setErrors] = React.useState<string[]>([]);

  const checkError = (name: string, input: string) => {
    // check if input is inside the validation schema
    const validation = schema.find((er) => er.name === name);
    let newTodos: ValidationTodo[] = [];

    if (validation) {
      // get all validation todos
      const { todos } = validation;
      newTodos = todos;
      for (const todo of todos) {
        let newTodo = todo;
        // call each validation function with current input
        newTodo.resolved = todo.validation(input);

        // update todos with new data
        newTodos = newTodos.map((td) =>
          td.name === newTodo.name ? newTodo : td
        );
      }
    }
    return newTodos;
  };

  const setError = (name: string) =>
    setErrors((ers) => (!ers.includes(name) ? [...ers, name] : ers));

  const removeError = (name: string) =>
    setErrors((ers) => ers.filter((er) => er !== name));

  return (
    <ValidationContext.Provider
      value={{ errors, setError, removeError, checkError }}
    >
      {children}
    </ValidationContext.Provider>
  );
}
