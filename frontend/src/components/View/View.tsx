import { CSSProperties, StyleSheet, css } from "aphrodite";
import { createStyle } from "../../util/createStyle";

interface ViewProps {
  children?: any,
  container?: boolean,
  style?: CSSProperties;
  /****** Container Props ********/
  flexDirection?: 'row' | 'column',
  justifyContent?: | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'initial' | 'inherit',
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse',
  alignItems?: | 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'initial' | 'inherit',
  gap?: string;
  /****** Child Props ********/
  flexGrow?: number,
  flexShrink?: number,
  flexBasis?: number,
  flex?: string,
  /****** Common Layout Props ********/
  padding?: string,
  margin?: string,
  width?: string,
  height?: string,
  maxWidth?: string,
  maxHeight?: string

  onClick?: (() => void) | (() => Promise<void>)
}

function View({ ...props }: ViewProps) {
  const styles = StyleSheet.create({
    default: {
      display: props.container ? 'flex' : 'block',
      justifyContent: props.justifyContent || 'flex-start',
      flexDirection: props.flexDirection || 'row',
      flexGrow: props.flexGrow || 0,
      flexBasis: props.flexBasis || 'auto',
      flexShrink: props.flexShrink || 1,
      flexWrap: props.flexWrap || 'nowrap',
      flex: props.flex || '0 1 auto',
      gap: props.gap,
      alignItems: props.alignItems || 'stretch',
      margin: props.margin || '0',
      padding: props.padding || '0',
      width: props.width || 'auto',
      height: props.height || 'auto',
      maxWidth: props.maxWidth || 'none'
    },
  });

  return (
    <div
      className={css(styles.default, createStyle(props.style))}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}

export default View;