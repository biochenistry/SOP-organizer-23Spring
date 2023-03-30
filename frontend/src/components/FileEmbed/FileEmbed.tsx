import { css, StyleSheet } from 'aphrodite';
import React from 'react';

interface FileEmbedProps {
  docId: string;
  isEditing: boolean;
  isFullscreen?: boolean;
}

const FileEmbed: React.FC<FileEmbedProps> = ({
  docId,
  isEditing,
  isFullscreen,
}) => {
  const styles = StyleSheet.create({
    defaultFileEmbed: {
      width: '100%',
      height: '100%',
      border: 'none'
    },
  });

  // auto append either /edit or /preview depending on whether user has privilege or not
  if (isEditing) {
    return (
      <iframe
        className={css(styles.defaultFileEmbed)}
        src={'https://docs.google.com/document/d/' + docId + '/edit'}
        title={'Document ' + docId}
      />
    );
  }

  if (isFullscreen) {
    // Has zooming by default, but has a dark black background
    return (
      <iframe
        className={css(styles.defaultFileEmbed)}
        src={'https://docs.google.com/viewer?srcid=' + docId + '&pid=explorer&efh=false&a=v&chrome=false&embedded=true'}
        title={'Document ' + docId}
      />
    );
  } else {
    return (
      <iframe
        className={css(styles.defaultFileEmbed)}
        src={'https://docs.google.com/document/d/' + docId + '/preview'}
        title={'Document ' + docId}
      />
    );
  }
}

export default FileEmbed;