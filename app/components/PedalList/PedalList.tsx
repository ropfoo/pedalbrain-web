import type { EditorPedal } from "~/models/pedal.server";
import PedalListItem from "./PedalListItem";

interface PedalListProps {
  pedals: EditorPedal[];
}

export default function PedalList({ pedals }: PedalListProps) {
  if (!pedals) return <p>no pedals</p>;

  return (
    <div className="grid grid-cols-2">
      {pedals.map((pedal) => (
        <PedalListItem key={pedal?.id} pedal={pedal} />
      ))}
    </div>
  );
}
