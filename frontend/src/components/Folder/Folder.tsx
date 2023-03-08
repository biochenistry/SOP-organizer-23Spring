
import { CSSProperties } from 'aphrodite'

import { Folder, File } from '../Sidebar/Sidebar'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi'
import Paragraph from '../Paragraph/Paragraph';
import View from '../View/View';
import { Colors } from '../GlobalStyles';

type folderProps = {
  folder: Folder;
}

const fileLinkStyle: CSSProperties = {
  borderRadius: '4px',
  marginLeft: '24px',
  padding: '8px 12px',
  textDecoration: 'none',
  ':hover': {
    backgroundColor: Colors.neutralHover,
  },
  ':active': {
    backgroundColor: Colors.neutralActive,
  }
}

const SidebarFolder = (props: folderProps) => {
  const [collapseContents, setCollapse] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const collapse = () => (setCollapse(!collapseContents), setDropdown(!dropdown))

  return (
    <View container flexDirection='column' gap='12px'>
      <View container gap='8px' alignItems='center' style={{ cursor: 'pointer' }} onClick={collapse}>
        {dropdown ? <FiChevronDown /> : <FiChevronRight />}
        <Paragraph style={{ fontWeight: 'bold', fontSize: '20px' }}>{props.folder?.name}</Paragraph>
      </View>

      <View container flexDirection='column' gap='16px' padding='0 0 16px 0'>
        {collapseContents && props.folder?.contents.map((file, index) => {
          return (
            (file?.__typename === "File") ?
              <Link to={'/file/' + file.id} style={{ textDecoration: 'none' }}>
                <Paragraph style={fileLinkStyle}>{file.name}</Paragraph>
              </Link>
              :
              <View margin='0 0 0 24px'>
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

