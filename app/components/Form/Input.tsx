interface InputProps {
  label: string;
  name: string;
  defaultValue?: string | number;
}

export default function Input({ name, label, defaultValue }: InputProps) {
  return (
    <div className="mb-3">
      <label htmlFor={name}>
        <p className=" text-lightblue">{label}</p>
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        type="text"
        className="rounded-md border-2 border-lightblue bg-black py-1 px-2 text-white"
      />
    </div>
  );
}
