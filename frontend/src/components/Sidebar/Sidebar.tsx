import React, { MouseEvent, useState } from 'react'
import { CSSProperties, StyleSheet, css } from 'aphrodite'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import SidebarFolder from '../Folder/Folder';
import { Colors } from '../GlobalStyles';
import View from '../View/View';
import { Link, useLocation } from 'react-router-dom';
import Paragraph from '../Paragraph/Paragraph';
import { useAuthState } from '../Auth';
import TextField from '../TextField/TextField';
import Form from '../Form/Form';
import useForm from '../Form/useForm';
import { ROOT_FOLDER_ID } from '../..';
import { createStyle } from '../../util/createStyle';
import LoadingSpinner from '../LoadingSpinner';
import { FaSearch } from 'react-icons/fa';

const SEARCH_FILE = gql`
query searchFiles($query: String!) {
  search(query: $query) {
    id
    name
  }
}
`;

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

type SearchInput = {
  search: string;
}

type GetAllFoldersResponse = {
  folders: Folder[];
}

type SearchResult = {
  search: File[];
} | null;

type FileContentItem = Folder | File;

const fileLinkStyle: CSSProperties = {
  borderRadius: '4px',
  marginLeft: '24px',
  marginRight: '16px',
  padding: '4px 12px',
  textDecoration: 'none',
  ':hover': {
    backgroundColor: Colors.neutralHover,
  },
  ':active': {
    backgroundColor: Colors.neutralActive,
  }
}

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

const styles = StyleSheet.create({
  sidebarDragStyle: {
    cursor: 'ew-resize',
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    width: '1px',
    zIndex: 1,
    ':hover': {
      right: '-50px',
      width: '100px',
    },
  },
});

const sidebarContainerStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  borderRight: `1px solid ${Colors.harlineGrey}`,
  height: '100%',
  maxHeight: '100%',
  paddingTop: '2px',
  position: 'relative',
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

const adminLinkSelected: CSSProperties = {
  borderRight: `4px solid ${Colors.isuRed}`,
}

const fileLinkSelected: CSSProperties = {
  borderRight: `4px solid ${Colors.isuRed}`,
}

const Sidebar: React.FunctionComponent = () => {
  const location = useLocation();
  const { state } = useAuthState();
  const { data } = useQuery<GetAllFoldersResponse>(GET_ALL_FOLDERS);
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);
  var [searchFiles, { data: searchData, loading: searchIsLoading, variables: searchVariables }] = useLazyQuery<SearchResult>(SEARCH_FILE);

  const handleSearch = async (values: SearchInput) => {
    if (values.search === '' || values.search === undefined) return;

    await searchFiles({
      variables: {
        query: values.search,
      },
    });
  }

  const searchForm = useForm<SearchInput>({
    initialValues: {
      search: ''
    },
    onSubmit: handleSearch,
  });

  const searchButtonStyle: CSSProperties = {
    alignItems: 'center',
    borderRadius: '4px',
    color: Colors.isuRed,
    cursor: 'pointer',
    fill: Colors.isuRed,
    height: 'fit-content',
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

  const searchButtonDisabledStyle: CSSProperties = {
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

  const dragHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const startSize = sidebarWidth;
    const startPosition = { x: e.pageX, y: e.pageY };

    function onMouseMove(this: HTMLElement, ev: globalThis.MouseEvent) {
      const newWidth = startSize - startPosition.x + ev.pageX;

      if (newWidth >= 250) {
        setSidebarWidth(newWidth);
      }
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  }

  return (
    <View container flexDirection='column' justifyContent='space-between' style={{ ...sidebarContainerStyle, width: `${sidebarWidth}px`, maxWidth: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }}>

      <div className={css(styles.sidebarDragStyle)} onMouseDown={dragHandler}></div>

      <View container padding='8px' width='100%' >
        <Form handleSubmit={searchForm.handleSubmit} style={{ width: '100%' }}>
          <View container flexDirection='row' gap='4px' alignItems='center' width='100%'>
            <TextField placeholder='Search...' name='search' type='text' value={searchForm.values.search} onChange={searchForm.handleChange} onValidate={searchForm.handleValidate} required showClear />
            <View container style={{ ...searchButtonStyle, ...(searchForm.hasError ? searchButtonDisabledStyle : {}) }} onClick={() => { handleSearch(searchForm.values) }}>
              <FaSearch />
            </View>
          </View>
        </Form>
      </View>

      <View container flexDirection='column' gap='4px' height='100%' padding='8px 0 8px 8px' style={{ overflow: 'scroll' }}>
        {((!searchData && !searchIsLoading) || searchForm.values.search !== searchVariables?.query) ? data?.folders.map((folder, index) => {
          return (
            <div key={index}>
              <SidebarFolder folder={folder}></SidebarFolder>
            </div>
          );
        })
          :
          (searchIsLoading) ?
            <View container justifyContent='center'>
              <LoadingSpinner size='small' />
            </View>
            :
            <View container flexDirection='column' gap='4px' margin='0 0 0 -12px'>
              {searchData?.search.map((file, index) => {
                return (
                  <Link to={'/file/' + file.id} className={css(createStyle({ textDecoration: 'none', userSelect: 'none', ...(location.pathname === `/file/${file.id}` ? fileLinkSelected : {}) }))} key={index}>
                    <Paragraph style={{ ...fileLinkStyle, fontSize: '14px' }}>{file.name}</Paragraph>
                  </Link>
                );
              })}
              {searchData?.search.length === 0 &&
                <View container padding='0 16px'>
                  <Paragraph>No results found.</Paragraph>
                </View>
              }
            </View>
        }
      </View>

      {(state.user !== null) &&
        <View container flexDirection='column'>
          <View container flexDirection='column' style={{ ...adminLinksStyle, cursor: 'pointer' }} onClick={() => { window.open('https://drive.google.com/drive/folders/' + ROOT_FOLDER_ID); }}>
            <Paragraph>Open Drive Folder</Paragraph>
          </View>
          {(state.user?.isAdmin) &&
            <Link to='/users' style={{ textDecoration: 'none' }}>
              <View container flexDirection='column' style={{ ...adminLinksStyle, ...(location.pathname === '/users' ? adminLinkSelected : {}) }}>
                <Paragraph>Manage Users</Paragraph>
              </View>
            </Link>
          }
        </View>
      }
    </View>
  )
}
export default Sidebar;


