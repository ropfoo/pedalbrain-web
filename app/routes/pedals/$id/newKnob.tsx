import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import Input from "~/components/Form/Input";
import Slider from "~/components/Form/Slider/Slider";
import SliderToggle from "~/components/Form/Slider/SliderToggle";
import { createKnob } from "~/models/knob.server";

const numString = z
  .string()
  .min(1, { message: "bla error" })
  .transform((input) => parseFloat(input));

const newKnobSchema = z.object({
  name: z.string().min(1, { message: "Type in a pedal name" }),
  size: numString,
  posX: numString,
  posY: numString,
  rotation: numString,
  pedalId: z.string().min(1),
});

export const action: ActionFunction = async ({ request, params }) => {
  const pedalId = params.id;
  const formData = await request.formData();
  const formEntries = Object.fromEntries(formData);

  const defaultKnobData = {
    rotation: "0",
    posX: "50",
    posY: "50",
  };

  const validatedSchema = newKnobSchema.safeParse({
    ...formEntries,
    ...defaultKnobData,
    pedalId,
  });

  if (!validatedSchema.success) {
    const formattedError = validatedSchema.error.format();
    return json(formattedError);
  } else {
    return await createKnob(validatedSchema.data);
  }
};

export default function NewKnobRoute() {
  const actionData = useActionData();
  console.log(actionData);

  return (
    <div>
      <Form method="post">
        <Input
          error={{
            hasError: actionData?.name,
            errorMessages: actionData?.name?._errors,
          }}
          label="label"
          name="name"
        />
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
