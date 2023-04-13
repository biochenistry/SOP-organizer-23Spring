import { css, StyleSheet } from 'aphrodite';
import React from 'react';
import View from '../View/View';

interface FileEmbedProps {
  docId: string;
  isEditing: boolean;
  scale?: number;
}

const FileEmbed: React.FC<FileEmbedProps> = ({
  docId,
  isEditing,
  scale
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

  return (
    <View container style={{ height: '100%', maxHeight: '100%', overflowY: 'scroll', width: '100%', transform: `scale(${scale || 1})`, marginTop: `${(((scale || 1)-1) * 420)}px` }}>
      <iframe
        className={css(styles.defaultFileEmbed)}
        src={'https://docs.google.com/document/d/' + docId + '/preview'}
        title={'Document ' + docId}
      />
    </View>
  );
}

export default FileEmbed;