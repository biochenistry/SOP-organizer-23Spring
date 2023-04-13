import React, { useState } from 'react';
import Modal from './Modal';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';
import Button from '../Button/Button';

export type ConfirmModalProps = {
  title: string;
  showCloseButton?: boolean;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel?: (data?: any) => void;
  onConfirm: ((data?: any) => any) | ((data?: any) => Promise<void>);
  data?: any;
  destructive?: boolean;
  handleClose?: () => void;
  id?: string;
  testId?: string;
}

/**
 * ConfirmModal is used to acquire confirmation from the user before performing a certain action. The user is able to either proceed with the action, or cancel.
 * 
 * ### Usage
 * 
 * ```jsx 
 * const modal = (
 *   <ConfirmModal title='Lorem ipsum' onCancel={() => { window.alert('You clicked the cancel button') }} onConfirm={() => { window.alert('You clicked the okay button') }}>
 *     <StyledParagraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pharetra in venenatis, tristique penatibus porttitor ac. Urna odio lacus leo tellus bibendum viverra feugiat. Ultrices convallis in nunc, pellentesque vulputate adipiscing sodales turpis diam. In phasellus et aliquam sit mauris suspendisse dictumst. Blandit varius sed tellus nunc, rhoncus. Est sit mi sit risus. Nibh quam sit at consectetur donec lorem morbi.</StyledParagraph>
 *   </ConfirmModal>
 * );
 * 
 * return (
 *   <ModalLauncher modal={modal}>
 *     {({ openModal }) => (
 *       <Button variant='primary' role='button' action={openModal} label='Open Modal' />
 *     )}
 *   </ModalLauncher>
 * );
 * ```
 */
export default function ConfirmModal(props: ConfirmModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    setIsLoading(true);

    await props.onConfirm(props.data);

    setIsLoading(false);
  }

  return (
    <Modal
      header={<ModalHeader title={props.title} showCloseButton={props.showCloseButton} />}

      body={
        <ModalBody>
          {props.children}
        </ModalBody>
      }

      footer={
        <ModalFooter>
          {({ closeModal }) => (
            <>
              <Button
                variant='secondary'
                onClick={() => {
                  if (props.onCancel) {
                    props.onCancel();
                  };
                  closeModal();
                }}
                label={props.cancelLabel || 'Cancel'}
              />
              
              <Button
                variant='primary'
                onClick={async () => {
                  await handleConfirm();
                  closeModal();
                }}
                label={props.confirmLabel || 'Okay'}
                isLoading={isLoading}
              />
            </>
          )}
        </ModalFooter>
      }

      handleClose={props.handleClose}
      id={props.id}
      testId={props.testId}
    />
  );
}