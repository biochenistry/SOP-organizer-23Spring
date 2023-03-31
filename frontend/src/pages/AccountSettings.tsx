import React from 'react';
import View from "../components/View/View";
import Button from "../components/Button/Button";
import Heading from '../components/Heading/Heading';
import Form from '../components/Form/Form';
import useForm from "../components/Form/useForm";
import TextField from '../components/TextField/TextField';
import { useAuthState } from "../components/Auth";
import { useState } from 'react';
import { gql, useMutation } from "@apollo/client";

const UPDATE_USER = gql`
mutation updateUser($userId: ID!, $firstname: String!, $lastname: String!, $email: String!) {
  success: updateUser(userId: $userId, firstname: $firstname, lastname: $lastname, email: $email)
}
`;

const UPDATE_PASS = gql`
mutation changePassword($userId: ID!, $newPassword: String!) {
  success: changePassword(userId: $userId, newPassword: $newPassword)
}
`;

type UpdateUserResponse = {
    success: boolean;
}

type UpdatePassResponse = {
    success: boolean;
}

type UserInput = {
    firstname: string;
    lastname: string;
    email: string;
}

type PasswordInput = {
    password: string;
}

/* Todo:
    - fix issue of not being able to edit name
    - make layout look prettier (fix spacing and positioning)
    - add confirmation message after changes are saved
    - add cancel button when editing profile
*/

export default function AccountSettings() {
    const { state } = useAuthState();
    const [updateUser] = useMutation<UpdateUserResponse>(UPDATE_USER, { errorPolicy: 'all' });
    const [changePassword] = useMutation<UpdatePassResponse>(UPDATE_PASS, { errorPolicy: 'all' });
    const [hasError, setHasError] = useState<boolean>(false);
    const [isChangingInfo, setIsChangingInfo] = useState<boolean>(false);
    const [isChangingPass, setIsChangingPass] = useState<boolean>(false);

    const handleUserUpdate = async (values: UserInput) => {
        const { data } = await updateUser({
            variables: {
                userId: state.user?.id,
                firstname: values.firstname,
                lastname: values.lastname,
                email: values.email,
            },
        });

        if (!data?.success) {
            setHasError(true);
        }

        setIsChangingInfo(false);
    }

    const handlePassUpdate = async (values: PasswordInput) => {
        const { data } = await changePassword({
            variables: {
                userId: state.user?.id,
                newPassword: values.password,
            },
        });

        if (!data?.success) {
            setHasError(true);
        }

        setIsChangingPass(false);
    }

    const userForm = useForm<UserInput>({
        initialValues: {
            firstname: state.user?.firstName != null ? state.user?.firstName : '',
            lastname: state.user?.lastName != null ? state.user?.lastName : '',
            email: state.user?.email != null ? state.user?.email : ''
        },
        onSubmit: handleUserUpdate,
    });

    const passwordForm = useForm<PasswordInput>({
        initialValues: {
            password: ''
        },
        onSubmit: handlePassUpdate,
    });

    return (
        <View container flexDirection='column' padding='24px' width='100%'>
            <Heading text='Account Settings' renderAs='h1' />
            <View container flexDirection='column' alignItems='center' justifyContent='center' gap='20px' height='100%' width='100%'>
                {isChangingPass ?
                    <Form handleSubmit={passwordForm.handleSubmit}>
                        <View container flexDirection='row' alignItems='center' justifyContent='center' padding='10px' gap='16px'>
                            <Heading text='New Password:' renderAs='h3' />
                            <TextField name='password' type='password' value={passwordForm.values.password} onChange={passwordForm.handleChange} onValidate={passwordForm.handleValidate} disabled={!isChangingPass} />
                        </View>
                        <View container flexDirection='row' alignItems='center' justifyContent='center' padding='10px' gap='16px'>
                            <Button variant='secondary' type='submit' label='Save' />
                            <Button variant='secondary' onClick={() => { setIsChangingPass(false); }} label='Cancel' />
                        </View>
                    </Form>
                    :
                    <View container flexDirection='column' alignItems='center' justifyContent='center'>
                        <Form handleSubmit={userForm.handleSubmit}>
                            <View container flexDirection='row' alignItems='center' justifyContent='center' padding='10px' gap='16px'>
                                <Heading text='Name:' renderAs='h3' />
                                <TextField name='firstName' type='text' description='First Name' value={userForm.values.firstname} onChange={userForm.handleChange} onValidate={userForm.handleValidate} disabled={!isChangingInfo} />
                                <TextField name='lastName' type='text' description='Last Name' value={userForm.values.lastname} onChange={userForm.handleChange} onValidate={userForm.handleValidate} disabled={!isChangingInfo} />
                            </View>
                            <View container flexDirection='row' alignItems='center' justifyContent='center' padding='10px' gap='16px'>
                                <Heading text='Email:' renderAs='h3' />
                                <TextField name='email' type='text' value={userForm.values.email} onChange={userForm.handleChange} onValidate={userForm.handleValidate} disabled={!isChangingInfo} />
                            </View>
                            <View container flexDirection='row' alignItems='center' justifyContent='center' gap='12px'>
                                {isChangingInfo ?
                                    <Button variant='secondary' type='submit' label='Save Changes' />
                                    :
                                    <View container flexDirection='row' alignItems='center' justifyContent='center' gap='12px'>
                                        <Button variant='secondary' onClick={() => { setIsChangingInfo(true); }} label="Edit Profile" />
                                        <Button variant='secondary' onClick={() => { setIsChangingPass(true); }} label="Change Password" />
                                    </View>
                                }
                            </View>
                        </Form>
                    </View>    
                }
            </View>
        </View>
    );
}