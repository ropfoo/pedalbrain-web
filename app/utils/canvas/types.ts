export type Position = {
  x: number;
  y: number;
};

export type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type KnobShape = {
  id: string;
  dragElement: Box;
  rotateElement: Box;
  degree: number;
  name: string;
};
