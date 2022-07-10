import type { EditorPedal } from "~/routes/pedal";
import { drawKnobShpe } from "./pedal/draw-knob-shape";
import { drawPedalShape } from "./pedal/draw-pedal-shape";
import type { Box } from "./types";

type DrawPedalParams = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  pedal: EditorPedal;
  selectedId?: string;
};

export function drawPedal({
  canvas,
  context,
  pedal,
  selectedId,
}: DrawPedalParams) {
  if (pedal) {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawPedalShape(context, pedal);

    // draw knobs
    pedal.knobs.map((knob) => drawKnobShpe(knob, context, selectedId));
  }
}

function drawTest(context: CanvasRenderingContext2D, { w, h, x, y }: Box) {
  context.fillStyle = "blue";
  context.fillRect(x, y, w, h);
}
