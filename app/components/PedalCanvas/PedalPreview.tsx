import type { EditorPedal } from "~/models/pedal.server";
import PedalCanvas from "./PedalCanvas";

interface PedalPreviewProps {
  pedal: EditorPedal;
  scale: number;
  resolution?: number;
}

export default function PedalPreview({
  pedal,
  scale,
  resolution = 0.4,
}: PedalPreviewProps) {
  if (!pedal) return <p>no data</p>;
  return (
    <div
      className="overflow-hidden rounded-lg"
      style={{
        width: pedal.width * scale,
        height: pedal.height * scale,
      }}
    >
      <div
        className="origin-top-left"
        style={{
          transform: `scale(${scale})`,
          marginLeft: -((500 - pedal.width) * scale) / 2,
          marginTop: -((500 - pedal.height) * scale) / 2,
        }}
      >
        <PedalCanvas pedal={pedal} resolution={resolution} />
      </div>
    </div>
  );
}
