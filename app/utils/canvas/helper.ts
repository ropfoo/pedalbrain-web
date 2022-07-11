import type { EditorPedal } from "~/routes/pedals/$id";
import { drawKnobShpe } from "./pedal/draw-knob-shape";
import { drawPedalShape } from "./pedal/draw-pedal-shape";

export const resolution = 2;

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
    context.clearRect(
      0,
      0,
      canvas.clientWidth * resolution,
      canvas.clientHeight * resolution
    );
    drawPedalShape(context, pedal);

    // draw knobs
    pedal.knobs.map((knob) => drawKnobShpe(knob, context, selectedId));
  }
}
