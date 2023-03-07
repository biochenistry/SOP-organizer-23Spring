
import { css, StyleSheet} from 'aphrodite'

import {Folder} from '../Sidebar/Sidebar'
import { Link } from 'react-router-dom'

type folderProps = {
    folder: Folder;
}

const SidebarFolder = (props:folderProps) => {
    return  (
        <>
            <span>{props.folder.name}</span>
           {props.folder.contents.map((file) => {
                return (

                    <div className={css(folderContents.loadingContainer)}>
                        <Link to={'/file/' + file.id}>
                            <span style={{ marginLeft: '24px', fontSize: '12px'}}>{file.name}</span>
                        </Link>
                    </div>
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