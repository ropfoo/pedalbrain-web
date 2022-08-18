import * as React from "react";
import type { Knob } from "@prisma/client";
import { Form, useSubmit } from "@remix-run/react";
import Input from "../Form/Input";
import SliderToggle from "../Form/Slider/SliderToggle";
import Slider from "../Form/Slider/Slider";

interface KnobOverlayProps {
  knob: Knob;
  width: number;
  onDelete?: () => void;
  onChange?: (updatedKnob: Knob) => void;
}

export default function KnobOverlay({
  knob,
  width,
  onDelete,
  onChange,
}: KnobOverlayProps) {
  const { name, id, size } = knob;

  const submit = useSubmit();

  const updateKnobGeneralButtonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div
      className="absolute bottom-0 rounded-xl border-2 border-blue bg-black p-6 drop-shadow-lg"
      style={{ width }}
    >
      <Form method="post">
        <input readOnly hidden type="text" name="id" value={id} />
        <input readOnly hidden type="text" name="size" value={size} />
        <div className="flex items-end">
          <Input
            label="Name"
            name="name"
            defaultValue={name}
            onChange={(input) => onChange && onChange({ ...knob, name: input })}
          />
          <div className="mr-5" />
          <SliderToggle value={size} label="size">
            <Slider
              value={size}
              min={20}
              max={120}
              onChange={(val) => onChange && onChange({ ...knob, size: val })}
              onAfterChange={() => submit(updateKnobGeneralButtonRef.current)}
            />
          </SliderToggle>
        </div>
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
