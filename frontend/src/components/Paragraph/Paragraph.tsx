interface ParagraphProps {
    text: string;
    color: string;
}

function Paragraph({ text }: ParagraphProps) {
    return (
        <p>{text}</p>
    )
}

export default Paragraph;