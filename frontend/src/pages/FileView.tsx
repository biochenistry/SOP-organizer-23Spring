import React from 'react';
import View from '../components/View/View';
import FileEmbed from '../components/FileEmbed/FileEmbed';
import Button from '../components/Button/Button';
import { useAuthState } from "../components/Auth";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CSSProperties } from 'aphrodite';
import { Colors } from '../components/GlobalStyles';
import Heading from '../components/Heading/Heading';
import { gql, useQuery } from '@apollo/client';
import LoadingSpinner from '../components/LoadingSpinner';
import Paragraph from '../components/Paragraph/Paragraph';
import ReactTimeAgo from 'react-time-ago';
import ActionMenu from '../components/ActionMenu/ActionMenu';
import ActionItem from '../components/ActionMenu/ActionItem';

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
  borderBottom: `1px solid ${Colors.harlineGrey}`,
  flexDirection: 'row',
  height: '48px',
  justifyContent: 'space-between',
  padding: '8px 16px',
  width: '100%',
};

export default function FileView() {
  const navigate = useNavigate();
  const { fileId } = useParams();
  const { state } = useAuthState();
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
        <View container flexDirection='row' gap='24px' alignItems='center'>
          <ActionMenu label='Download'>
            <ActionItem label='PDF' onClick={() => { downloadFile('pdf'); }} />
            <ActionItem label='DOCX' onClick={() => { downloadFile('docx'); }} />
          </ActionMenu>
          <Button label='Fullscreen' onClick={() => { navigate('/file/' + fileId + '/fullscreen'); }} variant='secondary' />
          {state.user &&
            (isEditing ?
            <Button variant='primary' onClick={() => { setIsEditing(false); refetchFile(); }} label='Done' />
            :
            <Button variant='primary' onClick={() => { setIsEditing(true); }} label='Edit' />)
          }
        </View>
      </View>

      <View flexGrow={1} height='100%' container>
        <FileEmbed docId={fileId} isEditing={isEditing} />
      </View>
    </View>
  );
}