import type { Knob } from "@prisma/client";
import type { Position } from "./canvas/types";

type CheckKnobTargetParams = {
  position: Position;
  knobs: Knob[];
  onSelect?: (knob: Knob) => void;
  onDeselect?: () => void;
};

export function checkKnobTarget({
  position,
  knobs,
  onSelect,
  onDeselect,
}: CheckKnobTargetParams) {
  const { x, y } = position;

  let newDragTarget: Knob | null = null;
  let newIsRotate = false;
  let isTarget = false;

  for (let i = 0; i < knobs.length; i++) {
    const knob = knobs[i];
    if (
      x >= knob.posX - 50 &&
      x <= knob.posX - 50 + knob.size &&
      y >= knob.posY + 50 &&
      y <= knob.posY + 50 + knob.size
    ) {
      newDragTarget = knob;

      newIsRotate = false;
      if (onSelect) onSelect(knob);

      isTarget = true;
      break;
    }
    if (
      x >= knob.posX &&
      x >= knob.posX &&
      x <= knob.posX + knob.size &&
      y >= knob.posY &&
      y <= knob.posY + knob.size
    ) {
      newDragTarget = knob;
      newIsRotate = true;
      if (onSelect) onSelect(knob);

      isTarget = true;
      break;
    }

    if (onDeselect) onDeselect();
  }
  return { isTarget, newDragTarget, newIsRotate };
}
