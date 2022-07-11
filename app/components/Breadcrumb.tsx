import { useMatches } from "@remix-run/react";

export default function Breadcrumb() {
  const matches = useMatches();

  console.log(matches);
  return (
    <div className="">
      {matches
        // skip routes that don't have a breadcrumb
        .filter((match) => match.handle && match.handle.breadcrumb)
        // render breadcrumbs!
        .map((match, index) => (
          <li key={index}>{match.handle?.breadcrumb(match)}</li>
        ))}
    </div>
  );
}
