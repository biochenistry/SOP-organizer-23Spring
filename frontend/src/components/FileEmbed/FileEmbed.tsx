import { css, StyleSheet } from 'aphrodite';
import React from 'react';

interface FileEmbedProps {
    docId: string;
    isEditing: boolean;
}

const FileEmbed: React.FC<FileEmbedProps> = ({
        docId,
        isEditing
    }) => {
        const styles = StyleSheet.create({
            defaultFileEmbed: {
                width: '1000px',
                height: '100vh',
                border: 'none'
            },
        });

    // auto append either /edit or /preview depending on whether user has privilege or not
    if (isEditing) {
        return (
            <iframe
                className={css(styles.defaultFileEmbed)}
                src={'https://docs.google.com/document/d/' + docId + '/edit'}
                /* iframe requires title */
                title='title'
            />
        );
    }
    return (
        <iframe
            className={css(styles.defaultFileEmbed)}
            src={'https://docs.google.com/document/d/' + docId + '/preview'}
            /* iframe requires title */
            title='title'
        />
    );
}

export default FileEmbed;