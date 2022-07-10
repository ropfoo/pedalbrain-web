import * as React from "react";
import { checkKnobTarget } from "~/utils/check-knob-target";
import type { Position, KnobShape } from "~/utils/canvas/types";
import { drawPedal } from "~/utils/canvas/helper";
import { useCanvas } from "~/hooks/useCanvas";
import { getPedal } from "~/models/pedal.server";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { Knob } from "@prisma/client";
import { updateKnob } from "~/models/knob.server";
import { H1 } from "~/components/Text";

export type EditorPedal = Awaited<ReturnType<typeof getPedal>>;

type LoaderData = {
  pedal: EditorPedal;
};

export const loader: LoaderFunction = async () => {
  const pedal = await getPedal();

  return json<LoaderData>({ pedal });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = formData.get("id")?.toString();
  const posX = Number(formData.get("posX"));
  const posY = Number(formData.get("posY"));

  if (id) {
    await updateKnob(id, posX, posY);
  }
  return true;
};

export default function PedalRoute() {
  const { pedal } = useLoaderData<LoaderData>();

  const { canvasRef, context } = useCanvas();

  const isMouseDown = React.useRef(false);
  const isRotationMode = React.useRef(false);

  const dragTarget = React.useRef<Knob | null>(null);

  const [selectedKnob, setSelectedKnob] = React.useState<Knob | null>(null);
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
    // setKnobs((knbs) =>
    //   knbs.map((knob) => {
    //     if (knob.id === dragTarget.current?.id) return dragTarget.current;
    //     return knob;
    //   })
    // );

    // setSelectedKnob(dragTarget.current);

    dragTarget.current = null;
    isRotationMode.current = false;
    isMouseDown.current = true;
  };

  const handleMouseOut = () => handleMouseUp();

  const changeName = (name: string) => {
    console.log(name, dragTarget);
    if (selectedKnob) {
      //   setKnobs((knbs) =>
      //     knbs.map((knob) => {
      //       if (knob.id === selectedKnob?.id) return { ...knob, name };
      //       return knob;
      //     })
      //   );
    }
  };

  if (!pedal) return <p>no pedal</p>;

  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <H1>{pedal.name}</H1>
        <div>
          {selectedKnob ? <p>{selectedKnob.name}</p> : <p>no selection</p>}
        </div>

        <Form method="post">
          <input hidden type="text" name="id" value={dragTarget.current?.id} />
          <input
            ref={inputPosXRef}
            hidden
            type="text"
            name="posX"
            value={dragTarget.current?.posX}
          />
          <input
            ref={inputPosYRef}
            hidden
            type="text"
            name="posY"
            value={dragTarget.current?.posY}
          />
          <button type="submit">update knob</button>
        </Form>
      </div>

      <div className="flex justify-end">
        <canvas
          className="rounded-2xl  bg-darkblue"
          height={600}
          width={600}
          style={{
            // backgroundColor: "lightgray",
            height: 600,
            width: 600,
            aspectRatio: "auto 1200 / 1200",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseOut}
          ref={canvasRef}
        />
      </div>
    </div>
  );
}
