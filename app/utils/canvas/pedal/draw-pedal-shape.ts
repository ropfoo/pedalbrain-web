import type { Box } from "../types";
import { drawRoundRect } from "../draw-round-rect";

export function drawPedalShape(context: CanvasRenderingContext2D, box?: Box) {
  // Shadow
  context.beginPath();
  drawRoundRect({
    context,
    box: { x: 100, y: 50, w: 300, h: 450 },
    radius: 40,
  });
  context.fillStyle = "rgba(5, 106, 247, 0.85)";
  context.fill();

  context.beginPath();
  drawRoundRect({
    context,
    box: { x: 100, y: 50, w: 300, h: 400 },
    radius: 30,
  });
  context.fillStyle = "rgb(5, 106, 247)";
  context.fill();
}
