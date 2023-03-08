import React from 'react';
import View from '../components/View/View';
import FileEmbed from '../components/FileEmbed/FileEmbed';
import Button from '../components/Button/Button';
import { useAuthState } from "../components/Auth";
import { useEffect, useState } from 'react';

/* Only need to pass in docId to the FileView page */
export type FileViewProps = {
    docId: string;
}

export default function FileView(props: FileViewProps) {
    const { state } = useAuthState();
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // checks to see if logged in user is admin (i.e. has edit privileges)
    useEffect(() => {
        if (state.user?.isAdmin) {
            setCanEdit(true);
        }
    }, [state, setCanEdit]);

    const downloadFile = () => {
        window.location.href = 'https://docs.google.com/feeds/download/documents/export/Export?id=' + props.docId + '&exportFormat=docx';
    }

    return (
        <View container alignItems='center' justifyContent='center' width='100%' flexDirection='row'>
            {/* This is the actual embedded file that gets displayed. */}
            <FileEmbed docId={props.docId} isEditing={isEditing} />

            {/* Todo: Align buttons at top of View container */}
            <View container flexDirection='column'>
                {/* Todo: Create style for these buttons (in Button component and then use className). */}

                <Button onClick={downloadFile} children="Download SOP" />
                <Button onClick={() => {setIsEditing(true);}} children="Edit Document" hidden={!canEdit || isEditing} />

                {/* Add any other doc save functionality to onClick function here. */}
                <Button onClick={() => {setIsEditing(false)}} children="Save & Finish" hidden={!isEditing} />

                {/* Other potential buttons: View Edit History, Delete SOP */}
            </View>
        </View>
    );
}