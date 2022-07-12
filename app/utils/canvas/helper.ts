import { drawKnobShpe } from "./pedal/draw-knob-shape";
import { drawPedalShape } from "./pedal/draw-pedal-shape";
import type { PedalShape } from "./types";

type DrawPedalParams = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  pedalShape: PedalShape;
  resolution: number;
  selectedId?: string;
};

export function drawPedal({
  canvas,
  context,
  pedalShape,
  resolution,
  selectedId,
}: DrawPedalParams) {
  if (pedalShape) {
    context.clearRect(
      0,
      0,
      canvas.clientWidth * resolution,
      canvas.clientHeight * resolution
    );
    drawPedalShape({ context, pedalShape, resolution });

    // draw knobs
    pedalShape.knobs.map((knob) =>
      drawKnobShpe({ knob, context, selectedId, resolution })
    );
  }
}
