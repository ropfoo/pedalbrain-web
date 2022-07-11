import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import { Link } from "react-router-dom";
import { getPedalListing } from "~/models/pedal.server";

type LoaderData = {
  pedals: Awaited<ReturnType<typeof getPedalListing>>;
};

export const loader: LoaderFunction = async () => {
  const pedals = await getPedalListing();

  return json<LoaderData>({ pedals });
};

export const handle = {
  breadcrumb: () => <Link to="/pedals">Pedals</Link>,
};

export default function PedalsRoute() {
  const { pedals } = useLoaderData<LoaderData>();
  return (
    <div>
      {pedals.map((pedal) => (
        <Link key={pedal.id} to={pedal.id}>
          {pedal.name}
        </Link>
      ))}
    </div>
  );
}
