import type { EditorPedal } from "~/models/pedal.server";
import { drawKnobShpe } from "./pedal/draw-knob-shape";
import { drawPedalShape } from "./pedal/draw-pedal-shape";

type DrawPedalParams = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  pedal: EditorPedal;
  resolution: number;
  selectedId?: string;
};

export function drawPedal({
  canvas,
  context,
  pedal,
  resolution,
  selectedId,
}: DrawPedalParams) {
  if (pedal) {
    context.clearRect(
      0,
      0,
      canvas.clientWidth * resolution,
      canvas.clientHeight * resolution
    );
    drawPedalShape({ context, pedal, resolution });

    // draw knobs
    pedal.knobs.map((knob) =>
      drawKnobShpe({ knob, context, selectedId, resolution })
    );
  }
}
