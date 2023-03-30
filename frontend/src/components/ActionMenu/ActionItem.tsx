import { css, StyleSheet } from 'aphrodite';
import React from 'react';
import { Colors } from '../GlobalStyles';
import Paragraph from '../Paragraph/Paragraph';

export type ActionItemProps = {
  label: string;
  onClick: (value?: any) => void;
  containerClick?: (value?: any) => void;
  data?: any;
  id?: string;
  testId?: string;
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    paddingLeft: '16px',
    paddingRight: '16px',
    height: '40px',
    minHeight: '40px',
    alignItems: 'center',
    cursor: 'default',
    color: Colors.textPrimary,
    fill: Colors.textPrimary,
    ':hover': {
      backgroundColor: Colors.isuRed,
      color: '#ffffff',
      fill: '#ffffff',
    },
  }
});

/**
 * Used within an `ActionMenu` to create a list of menu items. The `data` prop is provided to the click handler when the menu item is clicked.
 * 
 * ### Usage
 * ```jsx * 
 * <ActionItem label='My Action' onClick={clickHandler} />
 * ```
 */
export default function ActionItem(props: ActionItemProps) {
  const handleClick = () => {
    if (props.containerClick) {
      props.containerClick(props.data);
    }

    props.onClick(props.data);
  }

  return (
    <div onClick={handleClick} className={css(styles.container)} id={props.id} data-testid={props.testId} >
      <span style={{ fontSize: '16px', textAlign: 'left' }}>{props.label}</span>
    </div>
  );
}