import { Link } from "@remix-run/react";
import type { EditorPedal } from "~/models/pedal.server";
import type { PedalShape } from "~/utils/canvas/types";
import PedalPreview from "../PedalCanvas/PedalPreview";

interface PedalListItemProps {
  pedal: EditorPedal;
}

export default function PedalListItem({ pedal }: PedalListItemProps) {
  if (!pedal) return <p></p>;

  const pedalShape: PedalShape = {
    color: pedal?.color,
    knobs: pedal.knobs,
    size: {
      width: pedal.width,
      height: pedal.height,
    },
  };

  return (
    <Link to={pedal.id} prefetch="intent">
      <div className="flex items-center justify-between rounded-md bg-gradient-to-l from-lightblue">
        <p className="text-lg font-bold">{pedal.name}</p>
        <PedalPreview pedalShape={pedalShape} scale={0.4} resolution={0.75} />
      </div>
    </Link>
  );
}
