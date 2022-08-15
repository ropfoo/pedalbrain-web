import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import type { LoaderFunction } from "@remix-run/server-runtime";
import PedalList from "~/components/PedalList/PedalList";
import type { EditorPedal } from "~/models/pedal.server";
import { createPedal } from "~/models/pedal.server";
import { getPedals } from "~/models/pedal.server";
import Input from "~/components/Form/Input";
import Button from "~/components/Form/Button";
import { createPedalSchema } from "~/utils/zod/schema/pedal-schema";

type LoaderData = {
  pedals: EditorPedal[];
};

export const loader: LoaderFunction = async () => {
  const pedals = await getPedals();

  return json<LoaderData>({ pedals });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formEntries = Object.fromEntries(formData);

  const actionType = formData.get("_action");

  if (actionType === "createPedal") {
    const validationSchema = createPedalSchema.safeParse(formEntries);
    if (!validationSchema.success) {
      return json(validationSchema.error.format());
    } else {
      const newPedal = await createPedal(validationSchema.data);
      return redirect(`pedals/${newPedal.id}`);
    }
  }
};

export default function PedalsRoute() {
  const { pedals } = useLoaderData<LoaderData>();
  const actionData = useActionData();

  return (
    <div>
      <Form method="post">
        <Input
          label="Name"
          name="name"
          error={
            actionData?.name && { errorMessages: actionData?.name?._errors }
          }
        />
        <Button name="_action" value="createPedal" type="submit">
          create new
        </Button>
      </Form>
      <PedalList pedals={pedals} />
    </div>
  );
}
