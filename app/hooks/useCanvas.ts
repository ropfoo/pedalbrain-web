import * as React from "react";

export function useCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(
    null
  );

  // initialize the canvas context
  React.useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvas = canvasRef.current;
    if (canvas) {
      //     canvas.width = canvas.clientWidth;
      //   canvas.height = canvas.clientHeight;

      //   canvas.width = 1000;
      //   canvas.height = 750;
      //   canvas.style.width = "500px";
      //   canvas.style.height = "375px";

      // get context of the canvas
      setContext(canvas.getContext("2d"));
    }
  }, []);

  return {
    canvasRef,
    context,
  };
}
