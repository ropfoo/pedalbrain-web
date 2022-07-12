import * as React from "react";
import { EditorPedal, getPedal, updatePedal } from "~/models/pedal.server";
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  RouteMatch,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { updateKnob } from "~/models/knob.server";
import { H1 } from "~/components/Text";
import Input from "~/components/Form/Input";
import PedalCanvas from "~/components/PedalCanvas/PedalCanvas";
import type { PedalShape } from "~/utils/canvas/types";
import Slider from "~/components/Form/Slider";

type LoaderData = {
  pedal: EditorPedal;
};

export const meta: MetaFunction = ({ data }) => {
  const { pedal } = data as LoaderData;
  return {
    title: `${pedal?.name} - Pedalbrain`,
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.id) return false;

  const pedal = await getPedal(params.id);

  return json<LoaderData>({
    pedal,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  console.log("i got called", formData.get("_action"));

  if (formData.get("_action") === "updatePedal") {
    console.log("update");
    const id = formData.get("id")?.toString();
    const width = Number(formData.get("width"));
    const height = Number(formData.get("height"));

    if (id && width && height) {
      await updatePedal({ id, width, height });
    }

    return true;
  }

  const id = formData.get("id")?.toString();
  const posX = Number(formData.get("posX"));
  const posY = Number(formData.get("posY"));

  if (id) {
    await updateKnob(id, posX, posY);
  }
  return true;
};

export const handle = {
  breadcrumb: (match: RouteMatch) => {
    const { pedal } = match.data as LoaderData;
    return <Link to={match.pathname}>{pedal?.name}</Link>;
  },
};

export default function PedalRoute() {
  const { pedal } = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const [pedalWidth, setPedalWidth] = React.useState<number>(
    () => pedal?.width ?? 0
  );

  const [pedalShape, setPedalShape] = React.useState<PedalShape | null>(() =>
    pedal
      ? {
          color: pedal?.color,
          knobs: pedal.knobs,
          size: {
            width: pedal.width,
            height: pedal.height,
          },
        }
      : null
  );

  const updatePedalSubmitButtonRef = React.useRef<HTMLButtonElement>(null);

  if (!pedal) return <p>no pedal</p>;

  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <H1>{pedal.name}</H1>

        <Form method="post">
          <input hidden type="text" name="id" value={pedal.id} />
          <Slider
            value={pedalShape?.size.width}
            min={100}
            max={400}
            onChange={(val) =>
              setPedalShape(
                (ps) => ps && { ...ps, size: { ...ps?.size, width: val } }
              )
            }
            onAfterChange={() => submit(updatePedalSubmitButtonRef.current)}
          />

          <input
            className="text-black"
            name="width"
            value={pedalShape?.size.width}
          />
          <Input label="height" name="height" defaultValue={pedal.height} />
          <button
            ref={updatePedalSubmitButtonRef}
            type="submit"
            name="_action"
            value="updatePedal"
          >
            save
          </button>
        </Form>
      </div>

      <div className="flex justify-end">
        {pedalShape && <PedalCanvas hasBackground pedalShape={pedalShape} />}
      </div>
    </div>
  );
}
