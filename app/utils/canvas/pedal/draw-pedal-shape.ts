import { drawRoundRect } from "../draw-round-rect";
import type { Pedal } from "@prisma/client";

export function drawPedalShape(
  context: CanvasRenderingContext2D,
  pedal: Pedal
) {
  const { width, height } = pedal;

  const shadowAddition = 50;

  const posX = context.canvas.width / 2 - width / 2;
  const posY = context.canvas.height / 2 - height / 2 - shadowAddition / 2;

  // Shadow
  context.beginPath();
  drawRoundRect({
    context,
    box: { x: posX, y: posY, w: width, h: height + shadowAddition },
    radius: 40,
  });
  context.fillStyle = "rgba(5, 106, 247, 0.85)";
  context.fill();

  context.beginPath();
  drawRoundRect({
    context,
    box: { x: posX, y: posY, w: width, h: height },
    radius: 30,
  });
  context.fillStyle = "rgb(5, 106, 247)";
  context.fill();
}
