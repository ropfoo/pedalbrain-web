import type { Knob } from "@prisma/client";
import { drawRoundRect } from "../draw-round-rect";
import type { Box, Position } from "../types";

// draw rectangle with background
export function drawKnobShpe(
  knob: Knob,
  context: CanvasRenderingContext2D,
  selectedId?: string
) {
  const { posX, posY, name, size, id, rotation } = knob;

  const { x, y, w, h }: Box = { x: posX, y: posY, w: size, h: size };

  // Border
  if (id === selectedId) {
    context.beginPath();
    context.fillStyle = "rgba(255,255,255,0.8)";
    drawRoundRect({
      context,
      box: { x: x - w * 0.62, y: y - h * 1.1, w: w * 1.25, h: h * 3.25 },
      radius: 20,
    });
  }

  // Dragger
  context.beginPath();
  context.fillStyle = "green";
  context.fillRect(x - 50, y + 50, w, h);

  // drawTest(context, KnobShape.rotateElement);
  drawCircle(context, { x, y }, size);
  drawPointer(context, { x, y }, rotation, size);

  // Text
  context.fillStyle = "black";
  context.font = "16px Arial";
  context.textAlign = "center";
  context.fillText(name, x, y + 70);
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
