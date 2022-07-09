import * as React from "react";
import { checkKnobTarget } from "~/helper/check-knob-target";
import { drawKnobs, KnobShape, Position } from "~/helper/helper";

export default function PedalRoute() {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const [knobs, setKnobs] = React.useState<KnobShape[]>([
    {
      id: "a",
      dragElement: { x: 200, y: 220, w: 100, h: 50 },
      rotateElement: { x: 150, y: 170, w: 100, h: 100 },
      degree: 0,
      name: "Gain",
      isSelected: false,
    },

    {
      id: "b",
      dragElement: { x: 100, y: 120, w: 100, h: 50 },
      rotateElement: { x: 50, y: 70, w: 100, h: 100 },
      degree: 0,
      name: "Bass",
      isSelected: false,
    },
  ]);

  const isMouseDown = React.useRef(false);
  const isRotationMode = React.useRef(false);

  let dragTarget: KnobShape | null = null;
  //   const [selectedKnob, setSelectedKnob] = React.useState<KnobShape | null>(
  //     null
  //   );
  const selectedKnob = React.useRef<KnobShape | null>(null);
  const startPos = React.useRef<Position>({ x: 0, y: 0 });

  // initialize the canvas context
  React.useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current;
    if (canvasEle) {
      canvasEle.width = canvasEle.clientWidth;
      canvasEle.height = canvasEle.clientHeight;

      // get context of the canvas
      setCtx(canvasEle.getContext("2d"));
    }
  }, []);

  React.useEffect(() => {
    if (knobs && canvas.current && ctx) {
      drawKnobs(knobs, canvas.current, ctx);
    }
  }, [knobs, ctx]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (canvas.current) {
      startPos.current = {
        x: Number(e.nativeEvent.offsetX - canvas.current.clientLeft),
        y: Number(e.nativeEvent.offsetY - canvas.current.clientTop),
      };

      const { newDragTarget, isTarget, newIsRotate } = checkKnobTarget({
        position: startPos.current,
        knobShapes: knobs,
        onSelect: (knob) => {
          selectedKnob.current = knob;
        },
      });

      isMouseDown.current = isTarget;
      isRotationMode.current = newIsRotate;
      dragTarget = newDragTarget;
    }
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isMouseDown) return;

    if (canvas.current) {
      const mouseX = Number(e.nativeEvent.offsetX - canvas.current.clientLeft);
      const mouseY = Number(e.nativeEvent.offsetY - canvas.current.clientTop);
      const dx = mouseX - startPos.current.x;
      const dy = mouseY - startPos.current.y;

      startPos.current = {
        x: mouseX,
        y: mouseY,
      };

      if (!isRotationMode.current && dragTarget) {
        dragTarget.dragElement.x += dx;
        dragTarget.dragElement.y += dy;
        dragTarget.rotateElement.x += dx;
        dragTarget.rotateElement.y += dy;
      } else if (isRotationMode.current && dragTarget) {
        const radians = Math.atan2(mouseX - dx, mouseY - dy);
        const degree = radians * (180 / Math.PI) * -1 + 90;
        dragTarget.degree = degree;
      }
      if (knobs && ctx) drawKnobs(knobs, canvas.current, ctx);
    }
  };

  const handleMouseUp = () => {
    setKnobs((knbs) =>
      knbs.map((knob) => {
        if (knob.id === dragTarget?.id) return dragTarget;
        return knob;
      })
    );

    dragTarget = null;
    isRotationMode.current = false;
    isMouseDown.current = true;
  };

  const handleMouseOut = () => handleMouseUp();

  const storeCanvasAsJpg = () => {
    if (canvas.current) {
      const fullQuality = canvas.current.toDataURL("image/jpeg", 1.0);
      console.log(fullQuality);
    }
  };

  const changeName = (name: string) => {
    console.log(name, dragTarget);
    if (selectedKnob.current) {
      setKnobs((knbs) =>
        knbs.map((knob) => {
          if (knob.id === selectedKnob.current?.id) return { ...knob, name };
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
        onChange={(e) => changeName(e.target.value)}
      />
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
              isSelected: false,
            },
          ])
        }
      >
        add
      </button>

      <h1>Pedal</h1>

      <canvas
        height={800}
        width={800}
        style={{ backgroundColor: "lightgray" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        ref={canvas}
      ></canvas>
    </div>
  );
}
