import React, { useState } from 'react'
import { CSSProperties } from 'aphrodite'
import { gql, useQuery } from '@apollo/client'
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

function searchFiles(arg0: { variables: { search: string; }; }): { data: any; } | PromiseLike<{ data: any; }> {
  throw new Error('Function not implemented.');
}

const handleSearch = async (values: SearchInput) => {
  const { data } = await searchFiles({
    variables: {
      search: values.search,
    },
  });

}

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

const Sidebar: React.FunctionComponent = () => {
  const location = useLocation();
  const { state } = useAuthState();
  const { data } = useQuery<GetAllFoldersResponse>(GET_ALL_FOLDERS);
  const [searchState, setSearch] = useState(false);
  
  const search = () => {setSearch(!searchState)};

  const searchForm = useForm<SearchInput>({
    initialValues: {
      search: ''
    },
    onSubmit: handleSearch,
  });
  const clearSearchBar = () => {searchForm.handleChange('search', '')};

  return (
    <View container flexDirection='column' justifyContent='space-between' style={sidebarContainerStyle}>
      <View container gap='4px' flexDirection='column' padding='0 0 0 8px'>
        <Form handleSubmit={searchForm.handleSubmit}>
          <View container padding='0 8px 8px 0' gap='4px'>
            <Button variant='primary' type='submit' style={{width: '5%', marginTop: '4px'}} onClick={search}/>
            <TextField placeholder='Search...' name='search' type='text' value={searchForm.values.search} onChange={searchForm.handleChange} onValidate={searchForm.handleValidate} required/>
            <Button variant='primary' type='button' style={{width: '5%', marginTop: '4px'}} onClick={clearSearchBar}/>
          </View>
        </Form>
        {(!searchState)? data?.folders.map((folder, index) => {
          return (
            <div key={index}>
              <SidebarFolder folder={folder}></SidebarFolder>
            </div>
          );
        })
        : <View>
            Results
          </View>
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


