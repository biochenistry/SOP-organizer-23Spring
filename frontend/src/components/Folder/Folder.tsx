
import { css, StyleSheet} from 'aphrodite'

import {Folder, File} from '../Sidebar/Sidebar'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi'
import Paragraph from '../Paragraph/Paragraph';

type folderProps = {
    folder: Folder;
}

const SidebarFolder = (props:folderProps) => {
    const [collapseContents, setCollapse] = useState(false)
    const [dropdown, setDropdown] = useState(false)
    const collapse = () => (setCollapse(!collapseContents), setDropdown(!dropdown))
    
    return  (
        <>
            <span>
                {dropdown ? <FiChevronRight onClick={collapse}/> : <FiChevronDown onClick={collapse}/>}
                {props.folder?.name}
            </span>
            
           {collapseContents && props.folder?.contents.map((file, index) => {
                return (
                    <Paragraph>
                    <div className={css(folderContents.loadingContainer)} key={index}>
                        { (file?.__typename === "File") ? 
                            <Link to={'/file/' + file.id}>
                                <span style={{ marginLeft: '24px', fontSize: '12px'}}>{file.name}</span>
                            </Link>
                            :
                            <div>
                                {(file?.__typename === "Folder") &&
                                    <SidebarFolder folder={file}></SidebarFolder>
                                }
                            </div>
                        }
                    </div>
                    </Paragraph>
                )
            })}
        </>
    )
};

export default SidebarFolder;

const folderContents = StyleSheet.create({
    loadingContainer: {
      height: '50px',
      width: '100%',
      alignContent: 'center',
      justifyContent: 'flex-start'
    },
  });

