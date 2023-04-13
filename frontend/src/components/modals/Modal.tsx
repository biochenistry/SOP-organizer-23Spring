import { CSSProperties } from 'aphrodite';
import React, { PropsWithChildren, ReactElement } from 'react';
import { Colors } from '../GlobalStyles';
import { ModalHeaderProps } from './ModalHeader';
import View from '../View/View';
import { ModalFooterProps } from './ModalFooter';

export type ModalProps = {
  header: React.ReactNode;
  body: React.ReactNode;
  footer: React.ReactNode;
  style?: CSSProperties;
  onClose?: () => void;
  handleClose?: () => void;
  id?: string;
  testId?: string;
}

const backgroundStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#676e67cf',
  zIndex: 2,
}

const modalStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: Colors.harlineGrey,
  maxHeight: '624px',
  maxWidth: '576px',
  '@media (min-width: 1152px)': {
    minWidth: '576px',
  },
  '@media (min-width: 768px) and (max-width: 1151px)': {
    maxWidth: '576px',
    minWidth: '448px',
  },
  '@media (max-width: 767px)': {
    maxWidth: '400px',
    minWidth: '400px',
  }
}

/**
 * `Modal` can be used to create a custom modal component with a header, body, and footer section. Except for rare circumstances requiring custom behavior, it is generally better to use an `InfoModal`, `ConfirmModal`, or `FormModal` instead.
 * 
 * header - The header component
 * body - The body component
 * footer - The footer component
 * onClose - A function to be called before closing the modal
 * handleClosed - Automatically provided by ModalLauncher to handle closing the modal
 */
export default function Modal(props: ModalProps) {
  const header = props.header as ReactElement<PropsWithChildren<ModalHeaderProps>>;
  const footer = props.footer as ReactElement<PropsWithChildren<ModalFooterProps>>;

  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }

    if (props.handleClose) {
      props.handleClose();
    }
  }

  return (
    <View container style={backgroundStyle}>
      <View container flexDirection='column' style={{ ...modalStyle, ...props.style }} >
        {React.cloneElement(header, {
          onClose: handleClose,
        })}

        {props.body}

        {React.cloneElement(footer, {
          onClose: handleClose,
        })}
      </View>
    </View>
  );
}