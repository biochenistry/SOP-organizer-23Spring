import { css, StyleSheet } from 'aphrodite';
import React from 'react';

interface FileEmbedProps {
    title: string;
    docId: string;
}

const FileEmbed: React.FC<FileEmbedProps> = ({
        title,
        docId
    }) => {
        const styles = StyleSheet.create({
            defaultFileEmbed: {
                width: '1000px',
                height: '100vh',
                border: 'none'
            },
        });

    // auto append either /edit or /preview depending on whether user has privilege or not
    return (
        <iframe
            className={css(styles.defaultFileEmbed)}
            src={'https://docs.google.com/document/d/' + docId + '/edit'}
            title={title}
        />
    );
}

export default FileEmbed;