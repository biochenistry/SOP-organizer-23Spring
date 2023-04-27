import { css, CSSProperties, StyleSheet } from 'aphrodite';
import React, { ReactElement, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ActionItem from './ActionItem';
import { Colors } from '../GlobalStyles';
import { createStyle } from '../../util/createStyle';
import { FaChevronDown, FaEllipsisV } from 'react-icons/fa';
import { useFloating, offset } from '@floating-ui/react';

export type ActionMenuProps = {
  label?: string;
  children?: React.ReactNode;
  alignment?: 'left' | 'right';
  hideIcon?: boolean;
  popupStyle?: CSSProperties;
  id?: string;
  testId?: string;
}

const customStyles = StyleSheet.create({
  defaultColor: {
    color: Colors.textPrimary,
  },
  secondaryColor: {
    color: Colors.textSecondary,
  },
  view: {
    alignItems: "stretch",
    borderWidth: 0,
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    minWidth: 0,
  },
  popup: {
    borderWidth: '1px',
    borderColor: Colors.harlineGrey,
    borderStyle: 'solid',
    padding: '4px 0',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
  },
  shared: {
    alignItems: 'center',
    alignContent: 'center',
    border: 'none',
    borderRadius: '4px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: '8px',
    justifyContent: 'center',
    maxWidth: '200px',
    textDecoration: 'none',
    width: 'fit-content',
    height: '40px',
    padding: '0 16px',
    background: 'none',
    color: Colors.isuRed,
    fill: Colors.isuRed,
    paddingLeft: '0px',
    paddingRight: '0px',
    userSelect: 'none',
  },
  sharedLabel: {
    textAlign: 'left',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    position: 'relative',
    whiteSpace: 'nowrap',
  },
  interactions: {
    ':hover': {
      ':after': {
        content: '\'\'',
        position: 'absolute',
        height: '2px',
        width: 'calc(100% - 0px)',
        right: '0px',
        bottom: '0px',
        background: Colors.isuRed,
        borderRadius: '2px',
      },
    },
    ':active': {
      ':after': {
        content: '\'\'',
        position: 'absolute',
        height: '1px',
        width: 'calc(100% - 0px)',
        right: '0px',
        bottom: '0px',
        background: Colors.isuRedDark,
        borderRadius: '2px',
      },
    },
  },
  buttonInteractions: {
    ':active': {
      color: Colors.isuRed,
      fill: Colors.isuRed,
    },
  },
  hidden: {
    display: 'none',
  }
});

/**
 * A button with multiple action items displayed in a popup.
 * 
 * ### Usage
 * 
 * ```jsx 
 * <ActionMenu label='Action Menu'>
 *   <ActionItem label='Action Item 1' onClick={handleClick} data='1' />
 *   <ActionItem label='Action Item 2' onClick={handleClick} data='2' />
 *   <ActionItem label='Action Item 3' onClick={handleClick} data='3' />
 *   <ActionItem label='Action Item 4' onClick={handleClick} data='4' />
 * </ActionMenu>
 * ```
 */
export default function ActionMenu(props: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { x, y, strategy, refs } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(4)],
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (refs.domReference.current && (!refs.domReference.current.contains(target) && !refs.floating.current?.contains(target))) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [refs.domReference, refs.floating]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  }

  const host = document.querySelector('body');
  if (!host) {
    return null;
  }

  const mapChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      const c = child as ReactElement;

      if (c === null) {
        return null;
      }

      if (c.props && c.props.children && c.type !== ActionItem) {
        return React.cloneElement(c, {
          children: mapChildren(c.props.children),
        });
      }

      if (c.type === ActionItem) {
        return React.cloneElement(c, {
          containerClick: handleClick,
        });
      }
      else {
        return child;
      }
    });
  }

  return (
    <>
      <button id={props.id} onClick={handleClick} className={css(customStyles.shared, customStyles.buttonInteractions)} ref={refs.setReference}>
        {props.label ?
          (<><span className={css(customStyles.sharedLabel, customStyles.interactions, createStyle({ fontSize: '16px', textAlign: 'left' }))}>{props.label}</span><FaChevronDown className={css(props.hideIcon === true && customStyles.hidden)} /></>)
          :
          <FaEllipsisV />
        }
      </button>

      {isOpen && (
        ReactDOM.createPortal(
          <div ref={refs.setFloating} className={css(createStyle({ position: strategy, top: y ?? 0, left: x ?? 0, width: 'max-content' }))}>
            <div className={css(customStyles.view, customStyles.popup, createStyle({ boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)' }), createStyle(props.popupStyle))}>
              {mapChildren(props.children)}
            </div>
          </div>, host)
      )}
    </>
  );
}