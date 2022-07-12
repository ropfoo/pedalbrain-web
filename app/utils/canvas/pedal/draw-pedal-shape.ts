import { drawRoundRect } from "../draw-round-rect";
import type { PedalShape } from "../types";

type DrawPedalParams = {
  context: CanvasRenderingContext2D;
  pedalShape: PedalShape;
  resolution: number;
};

export function drawPedalShape({
  context,
  pedalShape,
  resolution,
}: DrawPedalParams) {
  const { width, height } = pedalShape.size;

  const resWidth = width * resolution;
  const resHeight = height * resolution;

  const shadowAddition = 50 * resolution;

  const posX = context.canvas.width / 2 - resWidth / 2;
  const posY = context.canvas.height / 2 - resHeight / 2 - shadowAddition / 2;

  // Shadow
  context.beginPath();
  drawRoundRect({
    context,
    box: { x: posX, y: posY, w: resWidth, h: resHeight + shadowAddition },
    radius: 35 * resolution,
  });
  context.fillStyle = "rgba(5, 106, 247, 0.85)";
  context.fill();

  context.beginPath();
  drawRoundRect({
    context,
    box: { x: posX, y: posY, w: resWidth, h: resHeight },
    radius: 25 * resolution,
  });
  context.fillStyle = "rgb(5, 106, 247)";
  context.fill();
}
