import { drawRoundRect } from "../draw-round-rect";
import type { Pedal } from "@prisma/client";
import type { EditorPedal } from "~/routes/pedals/$id";
//
type DrawPedalParams = {
  context: CanvasRenderingContext2D;
  pedal: EditorPedal;
  resolution: number;
};

export function drawPedalShape({
  context,
  pedal,
  resolution,
}: DrawPedalParams) {
  const width = pedal?.width ?? 0;
  const height = pedal?.height ?? 0;

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
