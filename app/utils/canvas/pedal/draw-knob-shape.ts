import type { Knob } from "@prisma/client";
import { drawRoundRect } from "../draw-round-rect";
// import { resolution } from "../helper";
import type { Box, Position } from "../types";
import { getDragArea, getRotationArea } from "./knob-areas";

type DrawKnobShapeParams = {
  knob: Knob;
  context: CanvasRenderingContext2D;
  resolution: number;
  selectedId?: string;
};

// draw rectangle with background
export function drawKnobShpe({
  knob,
  context,
  resolution,
  selectedId,
}: DrawKnobShapeParams) {
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
  const dragArea = getDragArea({ knob, resolution });
  if (id === selectedId) {
    context.beginPath();
    context.fillStyle = "rgba(255,255,255,0.5)";
    drawRoundRect({
      context,
      box: dragArea,
      radius: 20,
    });
  }

  drawCircle({ context, position: { x, y }, size: w, resolution });
  drawPointer({
    context,
    position: { x, y },
    degree: rotation,
    size: w,
    resolution,
  });

  // Text
  context.fillStyle = "black";
  context.font = `${13 * resolution}px Roboto`;
  context.textAlign = "center";
  context.fillText(name, x, y + w / 2 + 20 * resolution);
}

function drawCircle({
  context,
  position,
  size,
  resolution,
}: {
  context: CanvasRenderingContext2D;
  position: Position;
  size: number;
  resolution: number;
}) {
  context.beginPath();
  context.fillStyle = "black";
  context.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
  context.fill();
}

function drawPointer({
  context,
  position,
  degree,
  size,
  resolution,
}: {
  context: CanvasRenderingContext2D;
  position: Position;
  degree: number;
  size: number;
  resolution: number;
}) {
  const { x, y } = position;

  // Matrix transformation
  context.translate(x, y);
  context.rotate(degree);
  context.translate(-x, -y);

  // Rotated rectangle
  context.fillStyle = "white";
  //   context.fillRect(x, y, (size / 2) * 0.85, 5 * resolution);
  drawRoundRect({
    context,
    box: { x, y, w: (size / 2) * 0.85, h: 5 * resolution },
    radius: 2.5 * resolution,
  });
  context.setTransform(1, 0, 0, 1, 0, 0);
}

function drawRotationAreaShape(
  context: CanvasRenderingContext2D,
  { w, h, x, y }: Box
) {
  context.fillStyle = "blue";
  context.fillRect(x, y, w, h);
}
