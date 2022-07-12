import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { Link } from "react-router-dom";
import PedalList from "~/components/PedalList/PedalList";
import type { EditorPedal } from "~/models/pedal.server";
import { getPedals } from "~/models/pedal.server";

type LoaderData = {
  pedals: EditorPedal[];
};

export const loader: LoaderFunction = async () => {
  const pedals = await getPedals();

  return json<LoaderData>({ pedals });
};

export const handle = {
  breadcrumb: () => <Link to="/pedals">Pedals</Link>,
};

export default function PedalsRoute() {
  const { pedals } = useLoaderData<LoaderData>();

  return (
    <div>
      <PedalList pedals={pedals} />
    </div>
  );
}
