import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import Input from "~/components/Form/Input";
import Slider from "~/components/Form/Slider/Slider";
import SliderToggle from "~/components/Form/Slider/SliderToggle";
import { createKnob } from "~/models/knob.server";
import { createKnobSchema } from "~/utils/zod/schema/knob-schema";
import Button from "~/components/Form/Button";

export const action: ActionFunction = async ({ request, params }) => {
  const pedalId = params.id;
  const formData = await request.formData();
  const formEntries = Object.fromEntries(formData);

  const defaultKnobData = {
    rotation: "0",
    posX: "50",
    posY: "50",
  };

  const validatedSchema = createKnobSchema.safeParse({
    ...formEntries,
    ...defaultKnobData,
    pedalId,
  });

  if (!validatedSchema.success) {
    const formattedError = validatedSchema.error.format();
    return json(formattedError);
  } else {
    await createKnob(validatedSchema.data);
    return true;
  }
};

export default function NewKnobRoute() {
  const actionData = useActionData();

  console.log(actionData);

  return (
    <div>
      <Form method="post">
        {/* <Validation
          schema={[
            {
              name: "name",
              todos: [
                {
                  name: "Not in enoug chars",
                  resolved: false,
                  validation: (input) => input.length >= 5,
                },
                {
                  name: "Must include letter t",
                  resolved: false,
                  validation: (input) => input.includes("t"),
                },
              ],
            },
          ]}
        > */}
        <Input
          error={
            actionData?.name && {
              errorMessages: actionData?.name?._errors,
            }
          }
          label="label"
          name="name"
        />
        <input readOnly hidden type="text" name="size" value={80} />
        <SliderToggle value={80} label="size">
          <Slider value={80} min={10} max={100} onChange={(val) => null} />
        </SliderToggle>
        <Button>add knob</Button>
        {/* </Validation> */}
      </Form>
    </div>
  );
}
