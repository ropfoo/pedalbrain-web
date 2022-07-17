import * as React from "react";
import type { EditorPedal } from "~/models/pedal.server";
import type { PedalShape } from "~/utils/canvas/types";

export function useInitPedalShape(
  pedal: EditorPedal | null
): [
  PedalShape | null,
  React.Dispatch<React.SetStateAction<PedalShape | null>>
] {
  const initPedalShape: PedalShape | null = React.useMemo(
    () =>
      pedal
        ? {
            color: pedal.color,
            knobs: pedal.knobs,
            size: {
              width: pedal.width,
              height: pedal.height,
            },
          }
        : null,
    [pedal]
  );

  const [pedalShape, setPedalShape] = React.useState<PedalShape | null>(() =>
    initPedalShape ? { ...initPedalShape } : null
  );

  React.useEffect(() => {
    if (initPedalShape) setPedalShape(initPedalShape);
  }, [initPedalShape]);

  return [pedalShape, setPedalShape];
}
