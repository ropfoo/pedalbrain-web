import type { Knob } from "@prisma/client";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { useCanvas } from "~/hooks/useCanvas";
import { useOnOutsideClick } from "~/hooks/useOnOutsideClick";
import type { EditorPedal } from "~/models/pedal.server";
import type { LoaderData } from "~/routes/pedals/$id";
import { drawPedal } from "~/utils/canvas/helper";
import type { PedalShape, Position } from "~/utils/canvas/types";
import { checkKnobTarget } from "~/utils/check-knob-target";
import KnobOverlay from "./KnobOberlay";

interface PedalCanvasProps {
  pedalShape: PedalShape;
  setPedalShape: (ps: PedalShape) => void;
  resolution?: number;
  width?: number;
  height?: number;
  hasBackground?: boolean;
  pedal?: EditorPedal;
}

export default function PedalCanvas({
  pedalShape,
  resolution = 2,
  width = 500,
  height = 500,
  hasBackground = false,
  setPedalShape,
}: //   pedal,
PedalCanvasProps) {
  const { canvasRef, context } = useCanvas();

  const { pedal } = useLoaderData<LoaderData>();

  const [selectedKnob, setSelectedKnob] = React.useState<Knob | null>(null);

  const pedalCanvasWrapperRef = React.useRef<HTMLDivElement>(null);

  useOnOutsideClick(pedalCanvasWrapperRef, () => setSelectedKnob(null));

  const isMouseDown = React.useRef(false);
  const isRotationMode = React.useRef(false);

  const dragTarget = React.useRef<Knob | null>(null);
  const hasChanges = React.useRef(false);

  const startPos = React.useRef<Position>({ x: 0, y: 0 });

  const inputPosXRef = React.useRef<HTMLInputElement>(null);
  const inputPosYRef = React.useRef<HTMLInputElement>(null);

  const submitUpdateRef = React.useRef<HTMLButtonElement>(null);
  const updateSubmit = useSubmit();

  const selectedKnobId = selectedKnob?.id;
  const canvas = canvasRef.current;

  React.useEffect(() => {
    if (canvas && context && pedalShape) {
      drawPedal({
        canvas,
        context,
        pedalShape,
        resolution,
        selectedId: selectedKnobId,
      });
    }
  }, [canvas, context, selectedKnobId, pedalShape, resolution]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (canvasRef.current && pedalShape) {
      startPos.current = {
        x: Number(e.nativeEvent.offsetX - canvasRef.current.clientLeft),
        y: Number(e.nativeEvent.offsetY - canvasRef.current.clientTop),
      };

      const { newDragTarget, isTarget, newIsRotate } = checkKnobTarget({
        position: startPos.current,
        resolution,
        knobs: [...pedalShape.knobs],
        onSelect: (knob) => {
          if (inputPosXRef.current && inputPosYRef.current) {
            inputPosXRef.current.value = knob.posX.toString();
            inputPosYRef.current.value = knob.posY.toString();
          }

          setSelectedKnob(knob);
        },
        onDeselect: () => {
          setSelectedKnob(null);
        },
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
        dragTarget.current.posX = dragTarget.current.posX + dx;
        dragTarget.current.posY = dragTarget.current.posY + dy;
        if (inputPosXRef.current && inputPosYRef.current) {
          inputPosXRef.current.value = dragTarget.current.posX.toString();
          inputPosYRef.current.value = dragTarget.current.posY.toString();
        }
        hasChanges.current = true;
      } else if (isRotationMode.current && dragTarget.current) {
        const radians = Math.atan2(mouseX - dx, mouseY - dy);
        const degree = radians * (180 / Math.PI) * -1 + 90;
        dragTarget.current.rotation = degree;
      }

      if (context && pedalShape)
        drawPedal({
          canvas: canvasRef.current,
          context,
          pedalShape: {
            ...pedalShape,
            knobs: pedalShape.knobs.map((k) => {
              if (k.id === dragTarget.current?.id) return dragTarget.current;
              return k;
            }),
          },
          resolution,
          selectedId: selectedKnob?.id,
        });
    }
  };

  const handleMouseUp = () => {
    if (hasChanges.current) {
      hasChanges.current = false;
      updateSubmit(submitUpdateRef.current);
    }
    setPedalShape({
      ...pedalShape,
      knobs: pedalShape.knobs.map((k) => {
        if (k.id === selectedKnob?.id) return selectedKnob;
        return k;
      }),
    });
    dragTarget.current = null;
    isRotationMode.current = false;
    isMouseDown.current = true;
  };

  const handleMouseOut = () => handleMouseUp();
  return (
    <div ref={pedalCanvasWrapperRef} className="relative h-[500px]">
      <canvas
        className={clsx("rounded-2xl", { "bg-darkblue": hasBackground })}
        height={height * resolution}
        width={width * resolution}
        style={{
          // backgroundColor: "lightgray",
          height: height,
          width: width,
          aspectRatio: `auto ${height * resolution} / ${height * resolution}`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        ref={canvasRef}
      />

      <AnimatePresence>
        {selectedKnob && (
          <motion.div
            transition={{ bounce: 0, duration: 0.2 }}
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 35 }}
          >
            <KnobOverlay
              knob={selectedKnob}
              width={width}
              onDelete={() => setSelectedKnob(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Form hidden method="post">
        <input readOnly hidden type="text" name="id" value={selectedKnob?.id} />
        <input readOnly hidden name="name" value={selectedKnob?.name} />
        <input readOnly hidden name="size" value={selectedKnob?.size} />
        <input
          ref={inputPosXRef}
          readOnly
          hidden
          name="posX"
          value={inputPosXRef.current?.value}
        />
        <input
          ref={inputPosYRef}
          readOnly
          hidden
          name="posY"
          value={inputPosYRef.current?.value}
        />
        <button
          hidden
          ref={submitUpdateRef}
          name="_action"
          value="updateKnob"
          type="submit"
        >
          update knob
        </button>
      </Form>
    </div>
  );
}
