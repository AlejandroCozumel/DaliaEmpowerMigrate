'use client';

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

import Button from "@/components/ui/Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryActionDiabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryActionDiabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    // if (disabled) {
    //   return;
    // }
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, disabled]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (disabled) {
        return;
      }

      onSubmit();
    },
    [onSubmit, disabled]
  );

  const handleSecondaryAction = useCallback(() => {
    if (secondaryActionDiabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="
          justify-center
          items-center
          flex
          overflow-x-hidden
          overflow-y-auto
          fixed
          inset-0
          z-50
          outline-none
          focus:outline-none
          bg-neutral-800/70
        "
      >
        <div
          className="
          relative
          w-full
          md:w-4/6
          lg:w-3/6
          xl:w-2/5
          my-6
          mx-auto
          h-full
          lg:h-auto
          md:h-auto
          "
        >
          {/*content*/}
          <div
            className={`
            translate
            duration-300
            h-full
            ${showModal ? "translate-y-0" : "translate-y-full"}
            ${showModal ? "opacity-100" : "opacity-0"}
          `}
          >
            <div
              className="
              translate
              h-full
              lg:h-auto
              md:h-auto
              border-[1px]
              bg-white
              rounded-lg
              shadow-lg
              relative
              flex
              flex-col
              w-full
              outline-none
              focus:outline-none
            "
            >
              {/*header*/}
              <div
                className="
                flex
                items-center
                p-6
                rounded-t
                justify-center
                relative
                border-b-[1px]
                "
              >
                <button
                  className={`
                    p-1
                    border-0
                    hover:opacity-70
                    transition
                    absolute
                    left-9
                  `}
                  onClick={handleClose}
                  // disabled={disabled}
                >
                  <div className="p-2 bg-neutral-100 rounded-full">
                    <IoMdClose size={18} />
                  </div>
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              {/*body*/}
              <form onSubmit={handleSubmit} className="relative p-6 flex flex-col justify-between h-full gap-8">
                {body}
                <div
                  className="
                    flex
                    flex-row
                    items-center
                    gap-4
                    w-full
                    mt-4
                  "
                >
                  {secondaryAction && secondaryActionLabel && (
                    <Button
                      disabled={secondaryActionDiabled}
                      label={secondaryActionLabel}
                      onClick={handleSecondaryAction}
                      outline
                      type="button"
                    />
                  )}
                  <Button
                    disabled={disabled}
                    label={actionLabel}
                    type="submit"
                  />
                </div>
              </form>
              {/*footer*/}
              {footer && <div className="flex flex-col gap-2 p-6">{footer}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
