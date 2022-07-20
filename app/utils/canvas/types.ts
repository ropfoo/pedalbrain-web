import type { Knob } from "@prisma/client";

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type PedalShape = {
  color: string;
  size: Size;
  knobs: Map<string, Knob>;
};

export type KnobShape = {
  id: string;
  dragElement: Box;
  rotateElement: Box;
  degree: number;
  name: string;
};
