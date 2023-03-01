import React, { useState } from 'react'
import styled from 'styled-components'
import { SidebarData } from './SidebarData'
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

type Folder = {
  id: string;
  name: string;
  contents: File[];
}

type File = {
  id: string;
  name: string;
  created: string;
  lastUpdated: string;
  lastModifiedBy: string;
}

const Sidebar: React.FunctionComponent = () => {
  const { data } = useQuery<GetAllFoldersResponse>(GET_ALL_FOLDERS);

  const [close, setClose] = useState(true)
  const showSidebar = () => setClose(!close)
  return (
    <>
      <SidebarMenu close={close}>
        {data?.folders.map((folder) => {
          return (
            <p>{folder.name}
                {folder.contents.map((file) => {
                    return (
                        <p>
                            {file.name}
                        </p>
                    )
                })}
                
            </p>
          );
        })}

        {/* {SidebarData.map((item, index) => {
          return (
            <MenuItems key={index}>
              <span style={{ marginLeft: '16px' }}>{item.title}</span>
            </MenuItems>
          )
        })} */}
      </SidebarMenu>
    </>
  )
}
export default Sidebar

const MenuItems = styled.li`
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 90px;
    padding: 1rem 0 1.25rem;
`

const SidebarMenu = styled.div<{ close: boolean }>`
    width: 250px;
    background-color: #ffffff;
    border-right: 1px solid #D7DAD7;
    transition: .6s;
`