import React from 'react';
import View from '../View/View';

export type ModalBodyProps = {
  children?: React.ReactNode;
}

/**
 * Used to create custom body content for a Modal component. This essentially wraps children in a styled container.
 */
export default function ModalBody(props: ModalBodyProps) {
  return (
    <View container style={{ padding: '24px 32px', overflow: 'auto' }}>
      {props.children}
    </View>
  );
}