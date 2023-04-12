import { css, CSSProperties, StyleSheet } from 'aphrodite';
import React from 'react';
import { Colors } from '../GlobalStyles';
import View from '../View/View';
import Heading from '../Heading/Heading';
import Paragraph from '../Paragraph/Paragraph';

export type ModalHeaderProps = {
  title: string;
  showCloseButton?: boolean;
  onClose?: (data?: any) => void;
  testId?: string;
}

const containerStyle: CSSProperties = {
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: Colors.harlineGrey,
  borderTopLeftRadius: '4px',
  borderTopRightRadius: '4px',
  padding: '24px 32px',
  gap: '4px',
  minHeight: 'fit-content',
};

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    alignContent: 'center',
    background: 'none',
    border: 'none',
    borderRadius: '4px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-flex',
    fill: Colors.textPrimary,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: '8px',
    justifyContent: 'center',
    maxWidth: '200px',
    padding: '4px',
    position: 'absolute',
    right: '12px',
    textDecoration: 'none',
    top: '12px',
    width: 'fit-content',
    ':hover': {
      borderColor: Colors.isuRed,
      borderStyle: 'solid',
      borderWidth: '2px',
      padding: '2px',
      fill: Colors.isuRed,
    },
    ':active': {
      borderColor: Colors.isuRedDark,
      fill: Colors.isuRedDark,
    },
  },
  svg: {
    height: '20px',
    width: '20px',
  }
});

/**
 * Used to create a custom header for a Modal component.
 * 
 * `title` - The title displayed on the modal
 * `subtitle` - An optional description to provide further context
 * `showCloseButton` - An optional toggle to hide the close button
 */
export default function ModalHeader(props: ModalHeaderProps) {
  return (
    <View container style={containerStyle}>
      {props.showCloseButton !== false && <button onClick={props.onClose} className={css(styles.closeButton)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className={css(styles.svg)}><path d="M312.1 375c9.369 9.369 9.369 24.57 0 33.94s-24.57 9.369-33.94 0L160 289.9l-119 119c-9.369 9.369-24.57 9.369-33.94 0s-9.369-24.57 0-33.94L126.1 256L7.027 136.1c-9.369-9.369-9.369-24.57 0-33.94s24.57-9.369 33.94 0L160 222.1l119-119c9.369-9.369 24.57-9.369 33.94 0s9.369 24.57 0 33.94L193.9 256L312.1 375z"/></svg></button>}

      <Heading renderAs='h5' text={props.title} />
    </View>
  );
}