import type { Knob } from "@prisma/client";
import { getDragArea, getRotationArea } from "./canvas/pedal/knob-areas";
import type { Position } from "./canvas/types";

type CheckKnobTargetParams = {
  position: Position;
  knobs: Knob[];
  resolution: number;
  onSelect?: (knob: Knob) => void;
  onDeselect?: () => void;
};

export function checkKnobTarget({
  position,
  knobs,
  resolution,
  onSelect,
  onDeselect,
}: CheckKnobTargetParams) {
  const x = position.x * resolution;
  const y = position.y * resolution;

  let newDragTarget: Knob | null = null;
  let newIsRotate = false;
  let isTarget = false;

  for (let i = 0; i < knobs.length; i++) {
    const arKnob = knobs[i];
    // const knob = knobs[i];
    const knob = { ...arKnob };
    console.log(knob.name, knob);
    const rotationArea = getRotationArea({ knob, resolution });
    const dragArea = getDragArea({ knob, resolution });

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
