import { IoIosFolder } from 'react-icons/io'
import { CSSProperties, css } from 'aphrodite'
import { Folder } from '../Sidebar/Sidebar'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi'
import Paragraph from '../Paragraph/Paragraph';
import View from '../View/View';
import { Colors } from '../GlobalStyles';
import { createStyle } from '../../util/createStyle';
import { useAuthState } from '../Auth';
import { FaPen, FaPenAlt } from 'react-icons/fa';

type folderProps = {
  folder: Folder;
}

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

const fileLinkSelected: CSSProperties = {
  borderRight: `4px solid ${Colors.isuRed}`,
}

const SidebarFolder = (props: folderProps) => {
  const location = useLocation();
  const [collapseContents, setCollapse] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const collapse = () => (setCollapse(!collapseContents), setDropdown(!dropdown))
  const { state } = useAuthState();

  return (
    <View container flexDirection='column' gap='4px'>
      <View container gap='8px' alignItems='center' >
        <View container gap='8px' alignItems='center' style={{ cursor: 'pointer', 'user-select': 'none' }} onClick={collapse}>
          {dropdown ? <FiChevronDown /> : <FiChevronRight />}
          <Paragraph style={{ fontWeight: 'bold', fontSize: '16px' }}>{props.folder?.name}</Paragraph>
        </View>
        {(state.user?.isAdmin) &&
          <View>
            <Link to={'https://drive.google.com/drive/folders/' + props.folder?.id} target='_blank'>
              <FaPen style={{ fill: Colors.isuRed, width: '16px' }} />
            </Link>
          </View>
        }

      </View>

      <View container flexDirection='column' gap='4px' margin='0 0 0 -12px'>
        {collapseContents && props.folder?.contents.map((file, index) => {
          return (
            (file?.__typename === "File") ?
              <Link to={'/file/' + file.id} className={css(createStyle({ textDecoration: 'none', userSelect: 'none', ...(location.pathname === `/file/${file.id}` ? fileLinkSelected : {}) }))} key={index}>
                <Paragraph style={{ ...fileLinkStyle, fontSize: '14px' }}>{file.name}</Paragraph>
              </Link>
              :
              <View margin='0 0 0 24px' key={index}>
                {(file?.__typename === "Folder") &&
                  <SidebarFolder folder={file}></SidebarFolder>
                }
              </View>
          )
        })}
      </View>
    </View>
  )
};

export default SidebarFolder;

