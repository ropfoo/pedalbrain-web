import * as React from "react";
import {
  deletePedal,
  getPedal,
  updatePedalSize,
  updatePedalName,
} from "~/models/pedal.server";
import type { EditorPedal } from "~/models/pedal.server";
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import {
  deleteKnob,
  updateKnobGeneral,
  updateKnobPosition,
} from "~/models/knob.server";
import { H1 } from "~/components/Text";
import PedalCanvas from "~/components/PedalCanvas/PedalCanvas";
import Slider from "~/components/Form/Slider/Slider";
import SliderToggle from "~/components/Form/Slider/SliderToggle";
import { useInitPedalShape } from "~/hooks/useInitPedalShape";
import {
  updateKnobGeneralSchema,
  updateKnobPositionSchema,
} from "~/utils/zod/schema/knob-schema";
import {
  deletePedalSchema,
  updatePedalNameSchema,
} from "~/utils/zod/schema/pedal-schema";
import { ContextMenu, ContextMenuItem } from "~/components/ContextMenu";
import {
  DeletePedalDialog,
  UpdatePedalNameDialog,
} from "~/features/PedalDialogues";

export type LoaderData = {
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
  const formEntries = Object.fromEntries(formData);

  const pedalId = params.id;

  const actionType = formData.get("_action");

  if (actionType === "updatePedal") {
    const width = Number(formData.get("width"));
    const height = Number(formData.get("height"));

    if (pedalId && width && height) {
      await updatePedalSize({ id: pedalId, width, height });
    }
  }

  if (actionType === "deletePedal") {
    const validatedSchema = deletePedalSchema.safeParse(formEntries);
    if (!validatedSchema.success) {
      return json(validatedSchema.error.format());
    } else {
      await deletePedal(validatedSchema.data);
      return redirect("/pedals");
    }
  }

  if (actionType === "updatePedalName") {
    const validatedSchema = updatePedalNameSchema.safeParse(formEntries);
    if (!validatedSchema.success) {
      return json(validatedSchema.error.format());
    } else {
      const updatedPedal = await updatePedalName(validatedSchema.data);
      return updatedPedal;
    }
  }

  if (actionType === "updateKnobPosition") {
    const validatedSchema = updateKnobPositionSchema.safeParse(formEntries);

    if (!validatedSchema.success) {
      return json(validatedSchema.error.format());
    } else {
      await updateKnobPosition(validatedSchema.data);
    }
  }

  if (actionType === "updateKnobGeneral") {
    const validatedSchema = updateKnobGeneralSchema.safeParse(formEntries);

    if (!validatedSchema.success) {
      return json(validatedSchema.error.format());
    } else {
      await updateKnobGeneral(validatedSchema.data);
    }
  }

  if (actionType === "deleteKnob") {
    const id = formData.get("id")?.toString();
    if (id) {
      await deleteKnob(id);
    }
  }

  return true;
};

export default function PedalRoute() {
  const { pedal } = useLoaderData<LoaderData>();
  //   const initPedal: EditorPedal | null = { ...pedal };
  const submit = useSubmit();

  const [pedalShape, setPedalShape] = useInitPedalShape(pedal);

  const updatePedalSubmitButtonRef = React.useRef<HTMLButtonElement>(null);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showUpdateNameDialog, setShowUpdateNameDialog] = React.useState(false);

  if (!pedal) return <p>no pedal</p>;

  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <H1>{pedal.name}</H1>

        <ContextMenu>
          <ContextMenuItem onClick={() => setShowUpdateNameDialog(true)}>
            <p className="font-bold">rename</p>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setShowDeleteDialog(true)}>
            <p className="font-bold text-pink">delete pedal</p>
          </ContextMenuItem>
        </ContextMenu>

        <div className="mt-4" />

        <DeletePedalDialog
          isOpen={showDeleteDialog}
          close={() => setShowDeleteDialog(false)}
          pedal={pedal}
        />

        <UpdatePedalNameDialog
          isOpen={showUpdateNameDialog}
          close={() => setShowUpdateNameDialog(false)}
          pedal={pedal}
        />

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

        <div>
          <Link to="newKnob">new knob thiny</Link>
          <Outlet />
        </div>
      </div>

      <div className="flex justify-end">
        {pedalShape && pedal && (
          <PedalCanvas
            hasBackground
            pedalShape={pedalShape}
            setPedalShape={(ps) => setPedalShape(ps)}
          />
        )}
      </div>
    </div>
  );
}
