import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import Input from "~/components/Form/Input";
import Slider from "~/components/Form/Slider/Slider";
import SliderToggle from "~/components/Form/Slider/SliderToggle";
import { createKnob } from "~/models/knob.server";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const pedalId = params.id;

  const label = formData.get("label")?.toString();
  const size = Number(formData.get("size"));

  console.log(pedalId);

  if (label && size && pedalId)
    return await createKnob({
      name: label,
      pedalId,
      posX: 50,
      posY: 50,
      rotation: 0,
      size,
    });
};

export default function NewKnobRoute() {
  return (
    <div>
      <Form method="post">
        <Input label="label" name="label" />
        <input readOnly hidden type="text" name="size" value={80} />
        <SliderToggle value={80} label="size">
          <Slider value={80} min={10} max={100} onChange={(val) => null} />
        </SliderToggle>
        <button type="submit" name="_action" value="createKnob">
          create Knob
        </button>
      </Form>
    </div>
  );
}
