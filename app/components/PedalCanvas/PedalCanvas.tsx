import type { Knob } from "@prisma/client";
import * as React from "react";
import { useCanvas } from "~/hooks/useCanvas";
import type { EditorPedal } from "~/routes/pedals/$id";
import { drawPedal } from "~/utils/canvas/helper";
import type { Position } from "~/utils/canvas/types";
import { checkKnobTarget } from "~/utils/check-knob-target";
import KnobOverlay from "./KnobOberlay";

interface PedalCanvasProps {
  pedal: EditorPedal;
}

export default function PedalCanvas({ pedal }: PedalCanvasProps) {
  const { canvasRef, context } = useCanvas();

  const [selectedKnob, setSelectedKnob] = React.useState<Knob | null>(null);

  const isMouseDown = React.useRef(false);
  const isRotationMode = React.useRef(false);

  const dragTarget = React.useRef<Knob | null>(null);

  const startPos = React.useRef<Position>({ x: 0, y: 0 });

  const inputPosXRef = React.useRef<HTMLInputElement>(null);
  const inputPosYRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (canvasRef.current && context && pedal) {
      drawPedal({
        canvas: canvasRef.current,
        context,
        pedal,
        selectedId: selectedKnob?.id,
      });
    }
  }, [context, pedal]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (canvasRef.current && pedal) {
      startPos.current = {
        x: Number(e.nativeEvent.offsetX - canvasRef.current.clientLeft),
        y: Number(e.nativeEvent.offsetY - canvasRef.current.clientTop),
      };

      const { newDragTarget, isTarget, newIsRotate } = checkKnobTarget({
        position: startPos.current,
        knobs: pedal.knobs,
        onSelect: (knob) => {
          //   selectedKnob.current = knob;
          setSelectedKnob(knob);
        },
        onDeselect: () => setSelectedKnob(null),
      });

      isMouseDown.current = isTarget;
      isRotationMode.current = newIsRotate;
      dragTarget.current = newDragTarget;
    }
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isMouseDown) return;

    if (canvasRef.current) {
      const mouseX = Number(
        e.nativeEvent.offsetX - canvasRef.current.clientLeft
      );
      const mouseY = Number(
        e.nativeEvent.offsetY - canvasRef.current.clientTop
      );
      const dx = mouseX - startPos.current.x;
      const dy = mouseY - startPos.current.y;

      startPos.current = {
        x: mouseX,
        y: mouseY,
      };

      if (!isRotationMode.current && dragTarget.current) {
        dragTarget.current.posX += dx;
        dragTarget.current.posY += dy;
        console.log(dragTarget.current.posX);
        if (inputPosXRef.current && inputPosYRef.current) {
          inputPosXRef.current.value = dragTarget.current.posX.toString();
          inputPosYRef.current.value = dragTarget.current.posY.toString();
        }
      } else if (isRotationMode.current && dragTarget.current) {
        const radians = Math.atan2(mouseX - dx, mouseY - dy);
        const degree = radians * (180 / Math.PI) * -1 + 90;
        dragTarget.current.rotation = degree;
      }
      if (context && pedal)
        drawPedal({
          canvas: canvasRef.current,
          context,
          pedal,
          selectedId: selectedKnob?.id,
        });
    }
  };

  const handleMouseUp = () => {
    dragTarget.current = null;
    isRotationMode.current = false;
    isMouseDown.current = true;
  };

  const handleMouseOut = () => handleMouseUp();

  return (
    <div className="relative h-[500px]">
      <canvas
        className="rounded-2xl  bg-darkblue"
        height={1000}
        width={1000}
        style={{
          // backgroundColor: "lightgray",
          height: 500,
          width: 500,
          aspectRatio: "auto 1000 / 1000",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        ref={canvasRef}
      />

      {selectedKnob && (
        <KnobOverlay
          knob={selectedKnob}
          inputPosXRef={inputPosXRef}
          inputPosYRef={inputPosYRef}
          width={500}
        />
      )}
    </div>
  );
}
