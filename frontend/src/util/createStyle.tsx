import { StyleSheet, CSSProperties } from 'aphrodite';

/**
 * Creates a new StyleSheet style from an object of CSSProperties. Use this when you need to include styles given via a prop in a `css()` defined className.
 */
export function createStyle(style: CSSProperties | undefined | null) {
  if (!style) {
    style = {};
  }

  const styles = StyleSheet.create({
    s: style
  });

  return styles.s;
}