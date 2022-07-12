import type { PedalShape } from "~/utils/canvas/types";
import PedalCanvas from "./PedalCanvas";

interface PedalPreviewProps {
  pedalShape: PedalShape;
  scale: number;
  resolution?: number;
}

export default function PedalPreview({
  pedalShape,
  scale,
  resolution = 0.4,
}: PedalPreviewProps) {
  if (!pedalShape) return <p>no data</p>;
  return (
    <div
      className="overflow-hidden rounded-lg"
      style={{
        width: pedalShape.size.width * scale,
        height: pedalShape.size.height * scale,
      }}
    >
      <div
        className="origin-top-left"
        style={{
          transform: `scale(${scale})`,
          marginLeft: -((500 - pedalShape.size.width) * scale) / 2,
          marginTop: -((500 - pedalShape.size.height) * scale) / 2,
        }}
      >
        <PedalCanvas pedalShape={pedalShape} resolution={resolution} />
      </div>
    </div>
  );
}
