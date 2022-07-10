import type { Knob } from "@prisma/client";
import type { Box } from "../types";

export function getRotationArea(knob: Knob): Box {
  return {
    x: knob.posX - knob.size / 2,
    y: knob.size - knob.size / 2,
    w: knob.size,
    h: knob.size,
  };
}

export function getDragArea(knob: Knob): Box {
  const padding = 20;
  const size = knob.size + padding;

  return {
    x: knob.posX - size / 2,
    y: knob.posY - size / 2,
    w: size,
    h: size + 20,
  };
}
