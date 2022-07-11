import type { Knob } from "@prisma/client";
import { drawRoundRect } from "../draw-round-rect";
import { resolution } from "../helper";
import type { Box, Position } from "../types";
import { getDragArea, getRotationArea } from "./knob-areas";

// draw rectangle with background
export function drawKnobShpe(
  knob: Knob,
  context: CanvasRenderingContext2D,
  selectedId?: string
) {
  const { posX, posY, name, size, id, rotation } = knob;

  const { x, y, w, h }: Box = {
    x: posX * resolution,
    y: posY * resolution,
    w: size * resolution,
    h: size * resolution,
  };

  //show rotation helper shape
  //   const rotationArea = getRotationArea(knob);
  //   drawRotationAreaShape(context, rotationArea);

  // Drag Area
  const dragArea = getDragArea(knob);
  if (id === selectedId) {
    context.beginPath();
    context.fillStyle = "rgba(255,255,255,0.5)";
    drawRoundRect({
      context,
      box: dragArea,
      radius: 20,
    });
  }

  drawCircle(context, { x, y }, w);
  drawPointer(context, { x, y }, rotation, w);

  // Text
  context.fillStyle = "black";
  context.font = `${13 * resolution}px Arial`;
  context.textAlign = "center";
  context.fillText(name, x, y + w / 2 + 20 * resolution);
}

function drawCircle(
  context: CanvasRenderingContext2D,
  position: Position,
  size: number
) {
  context.beginPath();
  context.fillStyle = "black";
  context.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
  context.fill();
}

function drawPointer(
  ctx: CanvasRenderingContext2D,
  { x, y }: Position,
  degree: number,
  size: number
) {
  // Matrix transformation
  ctx.translate(x, y);
  ctx.rotate(degree);
  ctx.translate(-x, -y);

  // Rotated rectangle
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, (size / 2) * 0.85, 5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawRotationAreaShape(
  context: CanvasRenderingContext2D,
  { w, h, x, y }: Box
) {
  context.fillStyle = "blue";
  context.fillRect(x, y, w, h);
}
