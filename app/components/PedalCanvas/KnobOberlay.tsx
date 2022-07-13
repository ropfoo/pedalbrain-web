import * as React from "react";
import type { Knob } from "@prisma/client";
import { Form } from "@remix-run/react";

interface KnobOverlayProps {
  knob: Knob;
  inputPosXRef: React.RefObject<HTMLInputElement>;
  inputPosYRef: React.RefObject<HTMLInputElement>;
  width: number;
  onDelete?: () => void;
}

export default function KnobOverlay({
  knob,
  inputPosXRef,
  inputPosYRef,
  width,
  onDelete,
}: KnobOverlayProps) {
  const { name, id } = knob;

  return (
    <div
      className="absolute bottom-0 rounded-xl bg-blue p-6 drop-shadow-lg"
      style={{ width }}
    >
      <h3>{name}</h3>
      <Form method="post">
        <input readOnly hidden type="text" name="id" value={id} />
        <input
          ref={inputPosXRef}
          readOnly
          hidden
          type="text"
          name="posX"
          value={inputPosXRef.current?.value}
        />
        <input
          ref={inputPosYRef}
          readOnly
          hidden
          type="text"
          name="posY"
          value={inputPosYRef.current?.value}
        />
        <button name="_action" value="updateKnob" type="submit">
          update knob
        </button>
      </Form>

      <Form method="post">
        <input readOnly hidden type="text" name="id" value={id} />
        <button
          onClick={() => onDelete && onDelete()}
          name="_action"
          value="deleteKnob"
          type="submit"
        >
          delete knob
        </button>
      </Form>
    </div>
  );
}
