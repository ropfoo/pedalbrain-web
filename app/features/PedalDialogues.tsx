import * as React from "react";
import { Form, useFetcher } from "@remix-run/react";
import type { DialogProps } from "~/components/Dialog";
import Dialog from "~/components/Dialog";
import Button from "~/components/Form/Button";
import Input from "~/components/Form/Input";
import type { EditorPedal } from "~/models/pedal.server";

interface PedalDialogProps extends DialogProps {
  pedal: EditorPedal;
}

export function DeletePedalDialog({ isOpen, close, pedal }: PedalDialogProps) {
  if (!pedal) return null;
  return (
    <Dialog isOpen={isOpen} close={close}>
      <Form method="post">
        <p>Are you sure you want to delete "{pedal.name}"?</p>
        <div className="mb-5" />
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

export function UpdatePedalNameDialog({
  isOpen,
  close,
  pedal,
}: PedalDialogProps) {
  const fetcher = useFetcher();

  const hasNameErrors = fetcher.data?.name?._errors;
  const hasNameInput = fetcher.submission?.formData.get("name");

  React.useEffect(() => {
    if (hasNameInput && !hasNameErrors) {
      close();
    }
  }, [close, hasNameErrors, hasNameInput]);

  if (!pedal) return null;
  return (
    <Dialog isOpen={isOpen} close={close}>
      <fetcher.Form method="post">
        <p>Type in a new name for "{pedal.name}"</p>
        <div className="mb-5" />
        <Input
          label="New Name"
          name="name"
          error={
            fetcher.data?.name && {
              errorMessages: fetcher.data?.name?._errors,
            }
          }
        />
        <div className="mb-5" />
        <input readOnly hidden name="id" value={pedal.id} />
        <div className="flex">
          <Button onClick={close}>cancel</Button>
          <Button name="_action" value="updatePedalName" type="submit">
            confirm
          </Button>
        </div>
      </fetcher.Form>
    </Dialog>
  );
}
