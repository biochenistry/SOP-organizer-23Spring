import React from 'react';
import View from "../components/View/View";
import Button from "../components/Button/Button";
import Heading from '../components/Heading/Heading';
import { useAuthState } from "../components/Auth";

export default function AccountSettings() {
    const { state } = useAuthState();

    return (
        <View container flexDirection='column' padding='16px' width='100%'>
            <Heading text='Account Settings' renderAs='h2' />
            <View container flexDirection='column' alignItems='center' justifyContent='center' height='100%' width='100%'>
                <View container flexDirection='row' alignItems='center' padding='10px' gap='16px'>
                    <p>Name: {state.user?.lastName != null ? state.user?.firstName + " " + state.user.lastName : state.user?.firstName}</p>
                    <Button variant='secondary' label="Edit" />
                </View>

                <View container flexDirection='row' alignItems='center' padding='10px' gap='16px'>
                    <p>Email: {state.user?.email}</p>
                    <Button variant='secondary' label="Edit" />
                </View>

                <View container flexDirection='row' alignItems='center' padding='10px' gap='16px'>
                    <p>Password: </p>
                    <Button variant='secondary' label="Edit" />
                </View>
            </View>
        </View>
    );
}