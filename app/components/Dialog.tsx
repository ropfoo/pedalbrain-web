import * as React from "react";
import type { AriaDialogProps, AriaOverlayProps } from "react-aria";
import {
  FocusScope,
  OverlayContainer,
  useDialog,
  useModal,
  useOverlay,
  usePreventScroll,
} from "react-aria";

interface DialogWrapperProps extends AriaOverlayProps {
  title: string;
  children: React.ReactNode;
}

function ModalDialog(props: DialogWrapperProps) {
  const { title, children } = props;

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const ref = React.useRef(null);
  const { overlayProps, underlayProps } = useOverlay(props, ref);

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll();
  const { modalProps } = useModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = useDialog(props as AriaDialogProps, ref);

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 100,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="backdrop-blur-xl"
      {...underlayProps}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
          className="rounded-lg bg-darkblue p-5"
        >
          <h3 {...titleProps} style={{ marginTop: 0 }}>
            {title}
          </h3>
          {children}
        </div>
      </FocusScope>
    </div>
  );
}

export interface DialogProps {
  title?: string;
  isOpen: boolean;
  close: () => void;
  children?: React.ReactNode;
}

export default function Dialog({
  isOpen,
  close,
  children,
  title = "",
}: DialogProps) {
  return (
    <>
      {isOpen && (
        <OverlayContainer>
          <ModalDialog title={title} isOpen onClose={close} isDismissable>
            {children}
          </ModalDialog>
        </OverlayContainer>
      )}
    </>
  );
}
