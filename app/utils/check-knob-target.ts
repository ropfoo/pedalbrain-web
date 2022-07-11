import type { Knob } from "@prisma/client";
import { resolution } from "./canvas/helper";
import { getDragArea, getRotationArea } from "./canvas/pedal/knob-areas";
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
  const x = position.x * resolution;
  const y = position.y * resolution;

  let newDragTarget: Knob | null = null;
  let newIsRotate = false;
  let isTarget = false;

  for (let i = 0; i < knobs.length; i++) {
    const knob = knobs[i];

    const rotationArea = getRotationArea(knob);
    const dragArea = getDragArea(knob);

    if (
      x >= dragArea.x &&
      x <= dragArea.x + dragArea.w &&
      y >= dragArea.y &&
      y <= dragArea.y + dragArea.h
    ) {
      newDragTarget = knob;

      newIsRotate = false;
      if (onSelect) onSelect(knob);

      isTarget = true;
      break;
    }
    if (
      x >= rotationArea.x &&
      x >= rotationArea.x &&
      x <= rotationArea.x + rotationArea.w &&
      y >= rotationArea.y &&
      y <= rotationArea.y + rotationArea.h
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
