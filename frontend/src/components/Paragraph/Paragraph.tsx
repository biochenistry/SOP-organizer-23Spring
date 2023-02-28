interface ParagraphProps {
    text: string;
    color?: string;
    size?: number;
    align?: 'left' | 'center' | 'right';
}

function Paragraph({ ...props }: ParagraphProps) {
    return (
        <p
          style={{
            fontSize: props.size || 16,
            textAlign: props.align || 'left',
            color: props.color || 'black',
        }}>
            {props.text}
        </p>
    )
}

export default Paragraph;