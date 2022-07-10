interface TextProps {
  children: string | number;
}

export function H1({ children }: TextProps) {
  return <h1 className="mb-6 text-4xl font-bold">{children}</h1>;
}
