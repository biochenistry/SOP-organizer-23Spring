import React, { useState } from 'react'
import { CSSProperties, css } from 'aphrodite'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import SidebarFolder from '../Folder/Folder';
import { Colors } from '../GlobalStyles';
import View from '../View/View';
import { Link, useLocation } from 'react-router-dom';
import Paragraph from '../Paragraph/Paragraph';
import { useAuthState } from '../Auth';
import TextField from '../TextField/TextField';
import Button from '../Button/Button';
import Form from '../Form/Form';
import useForm from '../Form/useForm';
import { createStyle } from '../../util/createStyle';

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

const sidebarContainerStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  borderRight: `1px solid ${Colors.harlineGrey}`,
  height: '100%',
  maxWidth: '250px',
  minWidth: '250px',
  paddingTop: '2px',
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
  var [searchFiles, { data : searchData }] = useLazyQuery<SearchResult>(SEARCH_FILE);
  const [searchState, setSearch] = useState(false);
  const search = () => {setSearch(true)};

  const clearSearchBar = () => {searchForm.handleChange('search', ''); setSearch(false)};
  
  const handleSearch = async (values: SearchInput) => {
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

  return (
    <View container flexDirection='column' justifyContent='space-between' style={sidebarContainerStyle}>
      <View container gap='4px' flexDirection='column' padding='0 0 0 8px'>
        <Form handleSubmit={searchForm.handleSubmit}>
          <View container flexDirection='row' padding='0 8px 8px 0' gap='4px'>
            <TextField placeholder='Search...'  name='search' type='text' value={searchForm.values.search} onChange={searchForm.handleChange} onValidate={searchForm.handleValidate} required/>
              <Button label = 'S' variant='primary' type='submit' style={{ width: '20px', marginTop: '4px', padding: '0px'}} onClick={search}/>
              <Button label = 'X' variant='primary' type='button' style={{ width: '20px', marginTop: '4px', padding: '0px'}} onClick={clearSearchBar}/>
          </View>
        </Form>
        {(!searchState)? data?.folders.map((folder, index) => {
          return (
            <div key={index}>
              <SidebarFolder folder={folder}></SidebarFolder>
            </div>
          );
        })
        : 
            searchData?.search.map((file, index) => {
          return (
            <div key={index}>
              <View >
                <Link to={'/file/' + file.id} className={css(createStyle({ textDecoration: 'none', userSelect: 'none', ...(location.pathname === `/file/${file.id}` ? fileLinkSelected : {}) }))} key={index}>
                  <Paragraph style={{ ...fileLinkStyle, fontSize: '14px' }}>{file.name}</Paragraph>
                </Link>
              </View>
            </div>
          );
        })
        }
      </View>


      {(state.user?.isAdmin) &&
        <View container flexDirection='column' style={{ ...adminLinksStyle, ...(location.pathname === '/users' ? adminLinkSelected : {}) }}>
          <Link to='/users' style={{ textDecoration: 'none' }}><Paragraph>Manage Users</Paragraph></Link>
        </View>
      }
    </View>
  )
}
export default Sidebar;


