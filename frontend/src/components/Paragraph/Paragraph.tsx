interface ParagraphProps {
    children: React.ReactNode;
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
            {props.children}
        </p>
    )
}

export default Paragraph;