import React from 'react';
import View from '../components/View/View';
import FileEmbed from '../components/FileEmbed/FileEmbed';
import Button from '../components/Button/Button';
import { useAuthState } from "../components/Auth";
import { useEffect, useState } from 'react';

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

    return (
        <View container alignItems='center' justifyContent='center' width='100%' flexDirection='column'>
            <View container>

                {/* Todo: Add download functionality here. */}
                <Button onClick={() => console.log("Temp: Replace with download function.")} children="Download SOP" />
                <Button onClick={() => {setIsEditing(true);}} children="Edit Document" hidden={!canEdit} />

                {/* Add any other doc save functionality to onClick function here. */}
                <Button onClick={() => {setIsEditing(false)}} children="Save & Finish" hidden={!isEditing} />
            </View>
            <FileEmbed title='test-sop' docId={props.docId} isEditing={isEditing} />
        </View>
    );
}