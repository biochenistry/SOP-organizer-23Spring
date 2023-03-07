import React from 'react';

interface FileEmbedProps {
    title: string;
    source: string;
    width: string;
    height: string;
    // additional style stuff here
    // border: 'none'
}

const FileEmbed: React.FC<FileEmbedProps> = ({
        title,
        source,
        width,
        height
    }) => {
    return (
        <iframe
            src={source}
            title={title}
            width={width}
            height={height}
        />
    );
}

export default FileEmbed;