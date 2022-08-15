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
    knobs: new Map(pedal.knobs.map((knob) => [knob.id, knob])),
    size: {
      width: pedal.width,
      height: pedal.height,
    },
  };

  return (
    <Link to={pedal.id} prefetch="intent">
      <div className="flex h-[200px] items-center justify-between rounded-r-xl bg-gradient-to-l from-blue/70 pr-10">
        <p className="text-lg font-bold">{pedal.name}</p>
        <PedalPreview pedalShape={pedalShape} scale={0.4} resolution={0.75} />
      </div>
    </Link>
  );
}
