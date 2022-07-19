import * as React from "react";
import type { Knob } from "@prisma/client";
import { Form, useSubmit } from "@remix-run/react";
import Input from "../Form/Input";
import Button from "../Form/Button";
import SliderToggle from "../Form/Slider/SliderToggle";
import Slider from "../Form/Slider/Slider";

interface KnobOverlayProps {
  knob: Knob;
  width: number;
  onDelete?: () => void;
  onNameChange?: (name: string) => void;
  onSizeChange: (size: number) => void;
}

export default function KnobOverlay({
  knob,
  width,
  onDelete,
  onNameChange,
  onSizeChange,
}: KnobOverlayProps) {
  const { name, id, size } = knob;

  const submit = useSubmit();

  const updateKnobGeneralButtonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div
      className="absolute bottom-0 rounded-xl bg-blue p-6 drop-shadow-lg"
      style={{ width }}
    >
      <Form method="post">
        <input readOnly hidden type="text" name="id" value={id} />
        <Input
          label="Name"
          name="name"
          defaultValue={name}
          onChange={(input) => onNameChange && onNameChange(input)}
        />
        {/* <Button>update</Button> */}
        <input readOnly hidden type="text" name="size" value={size} />
        <SliderToggle value={size} label="size">
          <Slider
            value={size}
            min={20}
            max={120}
            onChange={(val) =>
              // update local pedal shape state
              onSizeChange(val)
            }
            onAfterChange={() => submit(updateKnobGeneralButtonRef.current)}
          />
        </SliderToggle>
        <button
          ref={updateKnobGeneralButtonRef}
          hidden
          name="_action"
          value="updateKnobGeneral"
          type="submit"
        />
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
