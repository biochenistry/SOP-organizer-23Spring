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
        // set height to screen height - header height
        const head = document.getElementById('header');
        let hgt = window.innerHeight;

        if (head != null) {
            hgt -= head.offsetHeight + 4;
        }
        
        const styles = StyleSheet.create({
            defaultFileEmbed: {
                width: '1000px',
                height: hgt,
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