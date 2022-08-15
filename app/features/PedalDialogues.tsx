import { Form } from "@remix-run/react";
import type { DialogProps } from "~/components/Dialog";
import Dialog from "~/components/Dialog";
import Button from "~/components/Form/Button";
import type { EditorPedal } from "~/models/pedal.server";

interface PedalDialogProps extends DialogProps {
  pedal: EditorPedal;
}

export function DeletePedalDialog({ isOpen, close, pedal }: PedalDialogProps) {
  if (!pedal) return null;
  return (
    <Dialog isOpen={isOpen} close={close}>
      <Form method="post">
        <p className="mb-5">
          Are you sure you want to delete the "{pedal.name}" pedal?
        </p>
        <input readOnly hidden name="id" value={pedal.id} />
        <div className="flex">
          <Button onClick={close}>cancel</Button>
          <Button name="_action" value="deletePedal" type="submit">
            delete
          </Button>
        </div>
      </Form>
    </Dialog>
  );
}
