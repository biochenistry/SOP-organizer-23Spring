import React from 'react';
import View from '../components/View/View';
import FileEmbed from '../components/FileEmbed/FileEmbed';
import Button from '../components/Button/Button';
import { useAuthState } from "../components/Auth";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function FileView() {
    const navigate = useNavigate();
    const { fileId } = useParams();
    const { state } = useAuthState();
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    if (!fileId) {
        navigate('/');
        return null;
    }

    if (state.user?.isAdmin) {
        setCanEdit(true);
    }

    const downloadFile = () => {
        window.location.href = 'https://docs.google.com/feeds/download/documents/export/Export?id=' + fileId + '&exportFormat=docx';
    }

    return (
        <View container alignItems='center' justifyContent='center' width='100%' flexDirection='row'>
            {/* This is the actual embedded file that gets displayed. */}
            <FileEmbed docId={fileId} isEditing={isEditing} />

            {/* Todo: Align buttons at top of View container */}
            <View container flexDirection='column'>
                {/* Todo: Create style for these buttons (in Button component and then use className). */}

                <Button variant='primary' onClick={downloadFile} label="Download SOP" />
                <Button variant='primary' onClick={() => {setIsEditing(true);}} label="Edit Document" hidden={!canEdit || isEditing} />

                {/* Add any other doc save functionality to onClick function here. */}
                <Button variant='primary' onClick={() => {setIsEditing(false)}} label="Save & Finish" hidden={!isEditing} />

                {/* Other potential buttons: View Edit History, Delete SOP */}
            </View>
        </View>
    );
}