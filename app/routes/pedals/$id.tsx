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
import Slider from "~/components/Form/Slider/Slider";
import SliderToggle from "~/components/Form/Slider/SliderToggle";

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
          <input readOnly hidden type="text" name="id" value={pedal.id} />
          <div className="flex">
            <SliderToggle value={pedalShape?.size.width} label="width">
              <Slider
                value={pedalShape?.size.width}
                min={100}
                max={400}
                onChange={(val) =>
                  // update local pedal shape state
                  setPedalShape(
                    (ps) => ps && { ...ps, size: { ...ps?.size, width: val } }
                  )
                }
                onAfterChange={() => submit(updatePedalSubmitButtonRef.current)}
              />
            </SliderToggle>
            <div className="mr-4" />
            <SliderToggle value={pedalShape?.size.height} label="height">
              <Slider
                value={pedalShape?.size.height}
                min={100}
                max={400}
                onChange={(val) =>
                  // update local pedal shape state
                  setPedalShape(
                    (ps) => ps && { ...ps, size: { ...ps?.size, height: val } }
                  )
                }
                onAfterChange={() => submit(updatePedalSubmitButtonRef.current)}
              />
            </SliderToggle>
          </div>

          <input readOnly hidden name="width" value={pedalShape?.size.width} />
          <input
            readOnly
            hidden
            name="height"
            value={pedalShape?.size.height}
          />

          <button
            hidden
            ref={updatePedalSubmitButtonRef}
            type="submit"
            name="_action"
            value="updatePedal"
          />
        </Form>
      </div>

      <div className="flex justify-end">
        {pedalShape && <PedalCanvas hasBackground pedalShape={pedalShape} />}
      </div>
    </div>
  );
}
