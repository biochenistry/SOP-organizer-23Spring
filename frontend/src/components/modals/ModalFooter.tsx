import { CSSProperties } from 'aphrodite';
import React from 'react';
import View from '../View/View';

type ChildProps = {
  closeModal: (data?: any) => void;
}

export type ModalFooterProps = {
  onClose?: (data?: any) => void;
  children?: React.ReactNode | React.FunctionComponent<ChildProps>;
  style?: CSSProperties;
}

const containerStyle: CSSProperties = {
  borderBottomLeftRadius: '4px',
  borderBottomRightRadius: '4px',
  padding: '24px 32px',
  flexDirection: 'row',
  gap: '16px',
  justifyContent: 'flex-end',
  minHeight: 'fit-content',
}

const defaultOnClose = () => {
  console.log('Warning: Modal close not implemented')
}

/**
 * Used to create a custom footer for a Modal component. Usually contains a set of buttons for handling modal actions.
 */
export default function ModalFooter(props: ModalFooterProps) {
  return (
    <View container style={{ ...containerStyle, ...props.style }}>
      {(props.children && typeof props.children === 'function') ? 
        props.children({ closeModal: props.onClose || defaultOnClose})
        :
        props.children
      }
    </View>
  );
}