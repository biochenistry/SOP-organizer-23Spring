import React from 'react'
import { CSSProperties } from 'aphrodite'
import { gql, useQuery } from '@apollo/client'
import SidebarFolder from '../Folder/Folder';
import { Colors } from '../GlobalStyles';
import View from '../View/View';
import { Link } from 'react-router-dom';
import Paragraph from '../Paragraph/Paragraph';
import { useAuthState } from '../Auth';

const GET_ALL_FOLDERS = gql`
query getAllFolders {
  folders {
    id
    name
    contents {
      ...on File {
        id
        name
        created
        lastUpdated
        lastModifiedBy
      }
      ...on Folder {
        id
        name
        contents {
          ...on File {
        id
        name
        created
        lastUpdated
        lastModifiedBy
      }
      ...on Folder {
        id
        name
        contents {
          ...on File {
        id
        name
        created
        lastUpdated
        lastModifiedBy
      }
        }
      }
        }
      }
    }
  }
}
`;

type GetAllFoldersResponse = {
  folders: Folder[];
}

type FileContentItem = Folder | File;

export type Folder = {
  id: string;
  name: string;
  contents: FileContentItem[];
  __typename: "Folder";
} | null;

export type File = {
  id: string;
  name: string;
  created: string;
  lastUpdated: string;
  lastModifiedBy: string;
  __typename: "File";
}

const sidebarContainerStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  borderRight: `1px solid ${Colors.harlineGrey}`,
  height: 'calc(100vh - 104px)',
  paddingTop: '24px',
  width: '250px',
}

const adminLinksStyle: CSSProperties = {
  borderTop: `1px solid ${Colors.harlineGrey}`,
  padding: '16px',
  ':hover': {
    backgroundColor: Colors.neutralHover,
  },
  ':active': {
    backgroundColor: Colors.neutralActive,
  }
}

const Sidebar: React.FunctionComponent = () => {
  const { state } = useAuthState();
  const { data } = useQuery<GetAllFoldersResponse>(GET_ALL_FOLDERS);

  return (
    <View container flexDirection='column' justifyContent='space-between' style={sidebarContainerStyle}>
      <View container gap='8px' flexDirection='column' padding='0 16px'>
        {data?.folders.map((folder, index) => {
          return (
            <div key={index}>
              <SidebarFolder folder={folder}></SidebarFolder>
            </div>
          );
        })}
      </View>

      {(state.user?.isAdmin) &&
        <View container flexDirection='column' style={adminLinksStyle}>
          <Link to='/users' style={{ textDecoration: 'none' }}><Paragraph>Manage Users</Paragraph></Link>
        </View>
      }
    </View>
  )
}
export default Sidebar;