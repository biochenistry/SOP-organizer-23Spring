import { StyleSheet, css, CSSProperties } from "aphrodite";
import { Colors } from "../GlobalStyles";
import { createStyle } from '../../util/createStyle';

export type LoadingSpinnerProps = {
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  style?: CSSProperties;
}

const spinnerKeyframes = {
  'from': {
    '-webkit-transform': 'rotate(0deg)',
    'transform': 'rotate(0deg)',
  },
  'to': {
    '-webkit-transform': 'rotate(359deg)',
    'transform': 'rotate(359deg)',
  },
}

const styles = StyleSheet.create({
  spinner: {
    display: 'block',
    border: '4px solid ' + Colors.harlineGrey,
    borderLeft: '4px solid rgba(0, 0, 0, 0)',
    borderRadius: '50%',
    animationName: [spinnerKeyframes],
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    'animation-timing-function': 'linear',
  },
  xsmall: {
    height: '16px',
    width: '16px',
    borderWidth: '2px',
  },
  small: {
    height: '24px',
    width: '24px',
    borderWidth: '2px',
  },
  medium: {
    height: '48px',
    width: '48px',
    borderWidth: '4px',
  },
  large: {
    height: '96px',
    width: '96px',
    borderWidth: '8px',
  },
});

/**
 * A circular spinner, used as a loading indicator.
 * 
 * ### Usage
 * 
 * ```jsx 
 * <CircularSpinner size='medium' />
 * ```
 */
export default function CircularSpinner(props: LoadingSpinnerProps) {
  return (
    <div className={css(styles.spinner, getSizeStyle(props.size), createStyle(props.style))}></div>
  );
}

function getSizeStyle(size?: 'xsmall' | 'small' | 'medium' | 'large') {
  if (size === 'xsmall') {
    return styles.xsmall
  }
  else if (size === 'small') {
    return styles.small;
  }
  else if (size === 'large') {
    return styles.large;
  }
  else {
    return styles.medium;
  }
} 