import { css, StyleSheet } from 'aphrodite';
import React, { useCallback, useEffect, useState } from 'react';
import View from '../View/View';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5.js';
import "react-pdf/dist/esm/Page/TextLayer.css";
import LoadingSpinner from '../LoadingSpinner';
import { Colors } from '../GlobalStyles';

const styles = StyleSheet.create({
  defaultFileEmbed: {
    width: '100%',
    height: '100%',
    border: 'none'
  },
  documentViewer: {
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
  },
  hidden: {
    height: '0px',
    visibility: 'hidden',
    width: '0px',
  },
  page: {
    backgroundColor: '#ffffff',
    border: `1px solid ${Colors.harlineGrey}`,
    marginTop: '24px',
  },
  lastPage: {
    marginBottom: '24px',
  }
});

type FileEmbedProps = {
  docId: string;
  isEditing: boolean;
  scale?: number;
  searchText?: string;
}

export default function FileEmbed(props: FileEmbedProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const docId = props.docId;
  const isEditing = props.isEditing;

  useEffect(() => {
    setIsLoading(true);
  }, [docId, isEditing]);

  const onDocumentLoadSuccess = (data: { numPages: number; }) => {
    setNumPages(data.numPages);
    setIsLoading(false);
  }

  const textRenderer = useCallback(
    (textItem: any) => highlightPattern(textItem.str, props.searchText || ''),
    [props.searchText]
  );

  // auto append either /edit or /preview depending on whether user has privilege or not
  if (props.isEditing) {
    return (
      <iframe
        className={css(styles.defaultFileEmbed)}
        src={'https://docs.google.com/document/d/' + props.docId + '/edit'}
        title={'Document ' + props.docId}
      />
    );
  }

  return (
    <View container style={{ height: '100%', justifyContent: 'center', maxHeight: '100%', overflowY: 'auto', width: '100%' }}>
      {isLoading &&
        <View container style={{ alignItems: 'center', height: '100%', justifyContent: 'center', width: '100%' }}>
          <LoadingSpinner size='large' />
        </View>
      }

      <Document onLoadSuccess={onDocumentLoadSuccess} file={'https://docs.google.com/document/d/' + props.docId + '/export?format=pdf'} className={css(isLoading && styles.hidden)}>
        {Array.from(
          new Array(numPages),
          (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={props.scale ? (props.scale + 0) : 2}
              renderTextLayer={true}
              renderAnnotationLayer={false}
              customTextRenderer={textRenderer}
              className={css(styles.page)}
            />
          ),
        )}
      </Document>
    </View>
  );
}

function highlightPattern(text: string, pattern: string) {
  return text.replace(pattern, (value) => `<mark>${value}</mark>`);
}