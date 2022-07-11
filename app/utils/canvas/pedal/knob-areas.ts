import type { Knob } from "@prisma/client";
import { resolution } from "../helper";
import type { Box } from "../types";

export function getRotationArea(knob: Knob): Box {
  const size = knob.size * resolution;
  return {
    x: knob.posX - size / 2,
    y: knob.size - size / 2,
    w: size,
    h: size,
  };
}

export function getDragArea(knob: Knob): Box {
  const padding = 20;
  const size = knob.size * resolution + padding;

  return {
    x: knob.posX * resolution - size / 2,
    y: knob.posY * resolution - size / 2,
    w: size,
    h: size + 25 * resolution,
  };
}
