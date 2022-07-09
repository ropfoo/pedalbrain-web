import { drawKnobShpe } from "./pedal/draw-knob-shape";
import { drawPedalShape } from "./pedal/draw-pedal-shape";
import type { Box, KnobShape } from "./types";

// draw boxes
export function draw(
  knobs: KnobShape[],
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  selectedId?: string
) {
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawPedalShape(context);

  // draw knobs
  knobs.map((knob) => drawKnobShpe(knob, context, selectedId));
}

function drawTest(context: CanvasRenderingContext2D, { w, h, x, y }: Box) {
  context.fillStyle = "blue";
  context.fillRect(x, y, w, h);
}
