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
import { FaSearch, FaSortNumericDown, FaSortAmountDownAlt, FaSortAlphaDown, FaCheck } from 'react-icons/fa';
import { useFloating, offset } from '@floating-ui/react';

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

const GET_FILES_BY_DATE = gql`
query getRecentlyModifiedFiles {
  listFilesByDate {
    id
    name
    created
    lastUpdated
    lastModifiedBy
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

type GetFilesByDateResponse = {
  listFilesByDate: File[];
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
    bottom: 0,
    cursor: 'ew-resize',
    height: 'calc(100% - 50px)',
    position: 'absolute',
    right: 0,
    width: '1px',
    zIndex: 1,
    ':hover': {
      right: '-50px',
      width: '100px',
    },
  },
  popupAction: {
    padding: '8px',
    ':hover': {
      backgroundColor: Colors.neutralHover,
      cursor: 'pointer',
    },
    ':active': {
      backgroundColor: Colors.neutralActive,
    },
  },
  sortPopupContainer: {
    backgroundColor: '#ffffff',
    borderColor: Colors.harlineGrey,
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: Colors.textPrimary,
    display: 'flex',
    flexDirection: 'column',
    padding: '4px 0',
    zIndex: 10,
  },
});

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

type SortMethod = 'RECENT' | 'NAME';

const Sidebar: React.FunctionComponent = () => {
  const location = useLocation();
  const { state } = useAuthState();
  const { data, loading: foldersAreLoading } = useQuery<GetAllFoldersResponse>(GET_ALL_FOLDERS);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sortMethod, setSortMethod] = useState<SortMethod>('NAME');
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);
  const [searchFiles, { data: searchData, loading: searchIsLoading, variables: searchVariables }] = useLazyQuery<SearchResult>(SEARCH_FILE);
  const [getFilesByDate, { data: recentFilesData, loading: recentFilesAreLoading }] = useLazyQuery<GetFilesByDateResponse>(GET_FILES_BY_DATE, {
    fetchPolicy: 'network-only',
  });

  const { x, y, strategy, refs } = useFloating({
    placement: 'bottom-end',
    middleware: [offset(4)],
  });

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

  const handleAlphabeticSort = () => {
    setIsOpen(false);
    setSortMethod('NAME');
  }

  const handleNumericSort = () => {
    setIsOpen(false);
    setSortMethod('RECENT');
    getFilesByDate({
      fetchPolicy: 'network-only',
    });
  }

  const getFoldersAndFiles = () => {
    if (sortMethod === 'NAME') {
      if (foldersAreLoading) {
        return (
          <View container justifyContent='center'>
            <LoadingSpinner size='small' />
          </View>
        );
      }

      return (
        data?.folders.map((folder, index) => {
          return (
            <div key={index}>
              <SidebarFolder folder={folder}></SidebarFolder>
            </div>
          );
        })
      );
    } else if (sortMethod === 'RECENT') {
      if (recentFilesAreLoading) {
        return (
          <View container justifyContent='center'>
            <LoadingSpinner size='small' />
          </View>
        );
      }

      return (
        recentFilesData?.listFilesByDate.map((file, index) => {
          return (
            <Link to={'/file/' + file.id} className={css(createStyle({ textDecoration: 'none', userSelect: 'none', ...(location.pathname === `/file/${file.id}` ? fileLinkSelected : {}) }))} key={index}>
              <Paragraph style={{ ...fileLinkStyle, fontSize: '14px', marginLeft: '0' }}>{file.name}</Paragraph>
            </Link>
          );
        })
      );
    }

    return null;
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
            <div onClick={() => { setIsOpen(!isOpen) }} ref={refs.setReference}>
              <FaSortAmountDownAlt style={{ cursor: 'pointer' }} />
            </div>
          </View>
          {
            isOpen &&
            <div ref={refs.setFloating} className={css(styles.sortPopupContainer, createStyle({ position: strategy, top: y ?? 0, left: x ?? 0, width: 'max-content' }))}>
              <div className={css(styles.popupAction)} onClick={handleAlphabeticSort}>
                <View container flexDirection='row' alignItems='center' gap='8px'>
                  {sortMethod === 'NAME' ? <FaCheck style={{ width: '12px' }} /> : <span style={{ width: '12px' }}></span>}
                  <Paragraph>Alphabetical</Paragraph>
                </View>
              </div>
              <div className={css(styles.popupAction)} onClick={handleNumericSort}>
                <View container flexDirection='row' alignItems='center' gap='8px'>
                  {sortMethod === 'RECENT' ? <FaCheck style={{ width: '12px' }} /> : <span style={{ width: '12px' }}></span>}
                  <Paragraph>Recently Updated</Paragraph>
                </View>
              </div>
            </div>
          }
        </Form>
      </View>

      <View container flexDirection='column' gap='4px' height='100%' padding='8px 0 8px 8px' style={{ overflow: 'auto' }}>
        {((!searchData && !searchIsLoading) || searchForm.values.search !== searchVariables?.query) ?
          getFoldersAndFiles()
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