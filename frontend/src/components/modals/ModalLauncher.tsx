import React, { PropsWithChildren, ReactElement, useState } from 'react';
import ReactDOM from 'react-dom';
import { ModalProps } from './Modal';
import { ConfirmModalProps } from './ConfirmModal';

type ChildProps = {
  openModal: (data?: any) => void;
}

export type ModalLauncherProps = {
  children: React.FunctionComponent<ChildProps>;
  modal: React.ReactNode;
}

/**
 * ### Usage
 * 
 * ```jsx
 * import { ModalLauncher } from '@barscience/global-components';
 * 
 * <ModalLauncher>
 *   {({ openModal }) => (
 *     // A button (or other clickable component) goes here that uses openModal as a click handler
 *   )}
 * </ModalLauncher>
 * ``
 * 
 * @param props 
 * @returns 
 */
export default function ModalLauncher(props: ModalLauncherProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [calledData, setCalledData] = useState<any>(null);

  const handleClose = () => {
    setIsOpen(false);
  }

  const openModal = (data: any) => {
    setIsOpen(true);
    
    if (data && data._reactName !== 'onClick') {
      setCalledData(data);
    }
  }

  const host = document.querySelector('body');
  if (!host) {
    return null;
  }

  const modal = props.modal as ReactElement<PropsWithChildren<ModalProps>> & ReactElement<PropsWithChildren<ConfirmModalProps>>;

  return (
    <>
      {props.children({
        openModal,
      })}

      {(isOpen && calledData !== null) &&
        ReactDOM.createPortal(React.cloneElement(modal, {
          handleClose: handleClose,
          data: calledData,
        }), host)
      }

      {(isOpen && calledData === null) &&
        ReactDOM.createPortal(React.cloneElement(modal, {
          handleClose: handleClose,
        }), host)
      }
    </>
  );
}