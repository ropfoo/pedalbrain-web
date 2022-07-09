import type { Box } from "./types";

type DrawRoundRectParams = {
  context: CanvasRenderingContext2D;
  box: Box;
  radius?: number;
  fill?: boolean;
  stroke?: boolean;
};

export function drawRoundRect({
  context,
  box,
  radius = 10,
  fill = true,
  stroke = false,
}: DrawRoundRectParams) {
  const { x, y, w, h } = box;
  const rad = { tl: radius, tr: radius, br: radius, bl: radius };

  context.beginPath();
  context.moveTo(x + rad.tl, y);
  context.lineTo(x + w - rad.tr, y);
  context.quadraticCurveTo(x + w, y, x + w, y + rad.tr);
  context.lineTo(x + w, y + h - rad.br);
  context.quadraticCurveTo(x + w, y + h, x + w - rad.br, y + h);
  context.lineTo(x + rad.bl, y + h);
  context.quadraticCurveTo(x, y + h, x, y + h - rad.bl);
  context.lineTo(x, y + rad.tl);
  context.quadraticCurveTo(x, y, x + rad.tl, y);
  context.closePath();
  if (fill) {
    context.fill();
  }
  if (stroke) {
    context.stroke();
  }
}
