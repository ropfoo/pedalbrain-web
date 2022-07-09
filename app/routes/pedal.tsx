import * as React from "react";
import { checkKnobTarget } from "~/utils/check-knob-target";
import type { Position, KnobShape } from "~/utils/canvas/types";
import { draw } from "~/utils/canvas/helper";
import { useCanvas } from "~/hooks/useCanvas";

export default function PedalRoute() {
  const { canvasRef, context } = useCanvas();

  const [knobs, setKnobs] = React.useState<KnobShape[]>([
    {
      id: "a",
      dragElement: { x: 200, y: 220, w: 100, h: 50 },
      rotateElement: { x: 150, y: 170, w: 100, h: 100 },
      degree: 0,
      name: "Gain",
    },

    {
      id: "b",
      dragElement: { x: 100, y: 120, w: 100, h: 50 },
      rotateElement: { x: 50, y: 70, w: 100, h: 100 },
      degree: 0,
      name: "Bass",
    },
  ]);

  const isMouseDown = React.useRef(false);
  const isRotationMode = React.useRef(false);

  const dragTarget = React.useRef<KnobShape | null>(null);

  const [selectedKnob, setSelectedKnob] = React.useState<KnobShape | null>(
    null
  );
  const startPos = React.useRef<Position>({ x: 0, y: 0 });

  React.useEffect(() => {
    if (knobs && canvasRef.current && context) {
      draw(knobs, canvasRef.current, context, selectedKnob?.id);
    }
  }, [knobs, context]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (canvasRef.current) {
      startPos.current = {
        x: Number(e.nativeEvent.offsetX - canvasRef.current.clientLeft),
        y: Number(e.nativeEvent.offsetY - canvasRef.current.clientTop),
      };

      const { newDragTarget, isTarget, newIsRotate } = checkKnobTarget({
        position: startPos.current,
        knobShapes: knobs,
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
        dragTarget.current.dragElement.x += dx;
        dragTarget.current.dragElement.y += dy;
        dragTarget.current.rotateElement.x += dx;
        dragTarget.current.rotateElement.y += dy;
      } else if (isRotationMode.current && dragTarget.current) {
        const radians = Math.atan2(mouseX - dx, mouseY - dy);
        const degree = radians * (180 / Math.PI) * -1 + 90;
        dragTarget.current.degree = degree;
      }
      if (knobs && context)
        draw(knobs, canvasRef.current, context, selectedKnob?.id);
    }
  };

  const handleMouseUp = () => {
    setKnobs((knbs) =>
      knbs.map((knob) => {
        if (knob.id === dragTarget.current?.id) return dragTarget.current;
        return knob;
      })
    );

    dragTarget.current = null;
    isRotationMode.current = false;
    isMouseDown.current = true;
  };

  const handleMouseOut = () => handleMouseUp();

  const storeCanvasAsJpg = () => {
    if (canvasRef.current) {
      const fullQuality = canvasRef.current.toDataURL("image/jpeg", 1.0);
      console.log(fullQuality);
    }
  };

  const changeName = (name: string) => {
    console.log(name, dragTarget);
    if (selectedKnob) {
      setKnobs((knbs) =>
        knbs.map((knob) => {
          if (knob.id === selectedKnob?.id) return { ...knob, name };
          return knob;
        })
      );
    }
  };

  return (
    <div className="App">
      <button onClick={storeCanvasAsJpg}>snap</button>
      <input
        className="border-2 border-blue-300"
        type="text"
        // value={selectedKnob?.name}
        // defaultValue={selectedKnob?.name}
        onChange={(e) => changeName(e.target.value)}
      />
      <div>
        {selectedKnob ? <p>{selectedKnob.name}</p> : <p>no selection</p>}
      </div>
      <button
        onClick={() =>
          setKnobs((knbs) => [
            ...knbs,
            {
              id: Date.now().toString(),
              dragElement: { x: 200, y: 220, w: 100, h: 50 },
              rotateElement: { x: 150, y: 170, w: 100, h: 100 },
              degree: 0,
              name: "Test",
            },
          ])
        }
      >
        add
      </button>

      <h1>Pedal</h1>

      <div className="flex justify-center">
        <canvas
          className="rounded-xl"
          height={600}
          width={600}
          style={{
            backgroundColor: "#040013",
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
