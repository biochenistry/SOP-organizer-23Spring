import React, { useState } from 'react'
import styled from 'styled-components'
import { css, StyleSheet} from 'aphrodite'
import { gql, useQuery } from '@apollo/client'

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
    }
  }
}
`;

type GetAllFoldersResponse = {
  folders: Folder[];
}

type FileContentItem = Folder | File;

type Folder = {
  id: string;
  name: string;
  contents: FileContentItem[];
  __typename: "Folder";
}

type File = {
  id: string;
  name: string;
  created: string;
  lastUpdated: string;
  lastModifiedBy: string;
  __typename: "File";
}

const Sidebar: React.FunctionComponent = () => {
  const { data } = useQuery<GetAllFoldersResponse>(GET_ALL_FOLDERS);

  /** 
   * Below checks if the contents of the folder is a folder or a file
  if (data?.folders[0].contents[0].__typename === "File") {

  }
  **/

  const [close, setClose] = useState(true)
  const showSidebar = () => setClose(!close)
  return (
    <>
      <SidebarMenu close={close}>
        {data?.folders.map((folder) => {
          return (
            <li>{folder.name}
                {folder.contents.map((file) => {
                    return (
                        <div className={css(folderContents.loadingContainer)}>
                          <span style={{ marginLeft: '24px', fontSize: '12px'}}>{file.name}</span>
                        </div>
                    )
                })}
                
            </li>
          );
        })}
      </SidebarMenu>
    </>
  )
}
export default Sidebar

const folderContents = StyleSheet.create({
  loadingContainer: {
    height: '60px',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'flex-start'
  },
});

const SidebarMenu = styled.div<{ close: boolean }>`
    width: 250px;
    background-color: #ffffff;
    border-right: 1px solid #D7DAD7;
    transition: .6s;
`