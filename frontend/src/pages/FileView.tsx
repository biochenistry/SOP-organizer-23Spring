import React from 'react';
import View from '../components/View/View';
import FileEmbed from '../components/FileEmbed/FileEmbed';
import Button from '../components/Button/Button';
import { useAuthState } from "../components/Auth";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CSSProperties, StyleSheet, css } from 'aphrodite';
import { Colors } from '../components/GlobalStyles';
import Heading from '../components/Heading/Heading';
import { gql, useQuery } from '@apollo/client';
import LoadingSpinner from '../components/LoadingSpinner';
import Paragraph from '../components/Paragraph/Paragraph';
import ReactTimeAgo from 'react-time-ago';
import ActionMenu from '../components/ActionMenu/ActionMenu';
import ActionItem from '../components/ActionMenu/ActionItem';
import { FaMinus, FaPen, FaPlus } from 'react-icons/fa';

const GET_FILE_DETAILS = gql`
query getFileDetails($id: ID!) {
  file(id: $id) {
    id
    name
    created
    lastUpdated
    lastModifiedBy
  }
}
`;

type GetFileDetailsResponse = {
  file: File | null;
}

type File = {
  id: string;
  name: string;
  created: string;
  lastUpdated: string;
  lastModifiedBy: string;
}

const toolbarStyle: CSSProperties = {
  alignItems: 'center',
  backgroundColor: '#ffffff',
  borderBottom: `1px solid ${Colors.harlineGrey}`,
  flexDirection: 'row',
  height: '48px',
  justifyContent: 'space-between',
  padding: '8px 16px',
  width: '100%',
  zIndex: 1,
  'user-select': 'none',
};

const styles = StyleSheet.create({

});

const zoomButtonStyle: CSSProperties = {
  alignItems: 'center',
  borderRadius: '4px',
  color: Colors.isuRed,
  cursor: 'pointer',
  fill: Colors.isuRed,
  justifyContent: 'center',
  padding: '8px',
  ':hover': {
    border: `2px solid ${Colors.isuRed}`,
    padding: '6px',
  },
  ':active': {
    backgroundColor: Colors.isuRedLight,
    border: `2px solid ${Colors.isuRedDark}`,
    padding: '6px',
  },
}

const zoomButtonDisabledStyle: CSSProperties = {
  color: Colors.neutralActive,
  cursor: 'default',
  fill: Colors.neutralActive,
  ':hover': {
    border: 'none',
    padding: '8px',
  },
  ':active': {
    backgroundColor: 'none',
    border: 'none',
    padding: '8px',
  },
}

const MAX_ZOOM = 1.7;
const MIN_ZOOM = 1.0;

export default function FileView() {
  const navigate = useNavigate();
  const { fileId } = useParams();
  const { state } = useAuthState();
  const [zoom, setZoom] = useState<number>(1);
  const { data: fileData, loading: fileIsLoading, refetch: refetchFile } = useQuery<GetFileDetailsResponse>(GET_FILE_DETAILS, {
    variables: {
      id: fileId,
    },
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!fileId) {
    navigate('/');
    return null;
  }

  const downloadFile = (format: 'docx' | 'pdf') => {
    window.location.href = 'https://docs.google.com/feeds/download/documents/export/Export?id=' + fileId + '&exportFormat=' + format;
  }

  const handleZoomIn = () => {
    if (zoom < MAX_ZOOM) {
      setZoom(zoom + 0.1);
    }
  }

  const handleZoomOut = () => {
    if (zoom > MIN_ZOOM) {
      setZoom(zoom - 0.1);
    }
  }

  if (fileIsLoading && !fileData) {
    return (
      <View container width='100%' flexDirection='column' height='100%' justifyContent='center' alignItems='center' >
        <LoadingSpinner size='large' />
      </View>
    );
  }

  if (!fileIsLoading && (!fileData || !fileData.file)) {
    return (
      <View container width='100%' flexDirection='column' height='100%' justifyContent='center' alignItems='center' >
        <Heading renderAs='h2' text='Oops! This file does not exist.' />
      </View>
    );
  }

  return (
    <View container width='100%' flexDirection='column' height='100%' >

      <View style={toolbarStyle} container>
        <View container flexDirection='row' gap='16px' alignItems='center'>
          <Heading renderAs='h3' text={fileData?.file?.name || ''} fontWeight='bold' />
          <Paragraph style={{ color: Colors.textSecondary, fontSize: '14px', fontStyle: 'italic' }}>
            Last updated <ReactTimeAgo date={new Date(fileData?.file?.lastUpdated || '')} locale="en-US" />
            {state.user && (' by ' + fileData?.file?.lastModifiedBy)}
          </Paragraph>
        </View>
        <View container flexDirection='row' gap='48px' alignItems='center'>
          {!isEditing &&
            <View container flexDirection='row' alignItems='center' gap='16px'>
              <View container style={{ ...zoomButtonStyle, ...(zoom <= MIN_ZOOM ? zoomButtonDisabledStyle : {}) }} onClick={handleZoomOut}>
                <FaMinus />
              </View>
              <Paragraph style={{ color: Colors.textSecondary }}>{Math.floor(zoom * 100)}%</Paragraph>
              <View container style={{ ...zoomButtonStyle, ...(zoom >= MAX_ZOOM ? zoomButtonDisabledStyle : {}) }} onClick={handleZoomIn}>
                <FaPlus />
              </View>
            </View>
          }
          <ActionMenu label='Download'>
            <ActionItem label='PDF' onClick={() => { downloadFile('pdf'); }} />
            <ActionItem label='DOCX' onClick={() => { downloadFile('docx'); }} />
          </ActionMenu>
          {state.user &&
            (isEditing ?
              <Button variant='primary' onClick={() => { setIsEditing(false); refetchFile(); }} label='Done' />
              :
              <Button variant='primary' onClick={() => { setIsEditing(true); }} label='Edit' />)
          }
        </View>
      </View>

      <View container flexGrow={1} height='100%' style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', 'user-select': 'none' }}>
        <FileEmbed docId={fileId} isEditing={isEditing} scale={zoom} />
      </View>
    </View>
  );
}