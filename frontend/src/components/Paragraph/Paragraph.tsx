import { CSSProperties, StyleSheet, css } from "aphrodite";
import { Colors } from "../GlobalStyles";
import { createStyle } from "../../util/createStyle";

interface ParagraphProps {
  children: React.ReactNode;
  style?: CSSProperties;
}

const styles = StyleSheet.create({
  default: {
    color: Colors.textPrimary,
    fontSize: '16px',
    textAlign: 'left',
  },
});

function Paragraph(props: ParagraphProps) {
  return (
    <p className={css(styles.default, createStyle(props.style))}>
      {props.children}
    </p>
  )
}

export default Paragraph;