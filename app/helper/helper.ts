export type Position = {
  x: number;
  y: number;
};

export type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type KnobShape = {
  id: string;
  dragElement: Box;
  rotateElement: Box;
  degree: number;
  name: string;
  isSelected: boolean;
};

// draw boxes
export function drawKnobs(
  knobs: KnobShape[],
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  knobs.map((knob) => drawFillRect(knob, context));
}

// draw rectangle with background
export function drawFillRect(
  KnobShape: KnobShape,
  context: CanvasRenderingContext2D
) {
  const { x, y, w, h } = KnobShape.dragElement;

  // Border
  if (KnobShape.isSelected) {
    context.beginPath();
    context.fillStyle = "green";
    context.strokeRect(x - 75, y - 75, w + 50, h + 150);
    context.stroke();
  }

  // Dragger
  context.beginPath();
  context.fillStyle = "red";
  context.fillRect(x - 50, y + 50, w, h);

  drawTest(context, KnobShape.rotateElement);
  drawCircle(context, { x, y });
  drawPointer(context, { x, y }, KnobShape.degree);

  // Text
  context.fillStyle = "black";
  context.font = "16px Arial";
  context.textAlign = "center";
  context.fillText(KnobShape.name, x, y + 70);
}

export function drawCircle(
  context: CanvasRenderingContext2D,
  position: Position
) {
  context.beginPath();
  context.fillStyle = "blue";
  context.arc(position.x, position.y, 50, 0, 2 * Math.PI);
  context.stroke();
}

function drawTest(context: CanvasRenderingContext2D, { w, h, x, y }: Box) {
  context.fillStyle = "blue";
  context.fillRect(x, y, w, h);
}

export function drawPointer(
  ctx: CanvasRenderingContext2D,
  { x, y }: Position,
  degree: number
) {
  // Matrix transformation
  ctx.translate(x, y);
  ctx.rotate(degree);
  ctx.translate(-x, -y);

  // Rotated rectangle
  ctx.fillStyle = "red";
  ctx.fillRect(x, y, 50, 5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
