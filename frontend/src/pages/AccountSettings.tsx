import React from 'react';
import View from "../components/View/View";
import Button from "../components/Button/Button";
import Heading from '../components/Heading/Heading';
import Form from '../components/Form/Form';
import useForm from "../components/Form/useForm";
import TextField from '../components/TextField/TextField';
import Paragraph from '../components/Paragraph/Paragraph';
import { useAuthState } from "../components/Auth";
import { useState } from 'react';
import { gql, useMutation } from "@apollo/client";
import { Colors } from "../components/GlobalStyles";

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

export default function AccountSettings() {
    const { state } = useAuthState();
    const [updateUser] = useMutation<UpdateUserResponse>(UPDATE_USER, { errorPolicy: 'all' });
    const [changePassword] = useMutation<UpdatePassResponse>(UPDATE_PASS, { errorPolicy: 'all' });
    const [hasError, setHasError] = useState<boolean>(false);
    const [isChangingName, setIsChangingName] = useState<boolean>(false);
    const [isChangingEmail, setIsChangingEmail] = useState<boolean>(false);
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

        if (data?.success) {
            window.location.reload();
        } else {
            setHasError(true);
        }
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
                <Form handleSubmit={userForm.handleSubmit}>
                    <View container flexDirection='row' alignItems='center' padding='10px' gap='16px'>
                        <Heading text='Name:' renderAs='h3' />
                        <TextField name='firstName' type='text' description='First Name' value={userForm.values.firstname} onChange={userForm.handleChange} onValidate={userForm.handleValidate} disabled={!isChangingName} />
                        <TextField name='lastName' type='text' description='Last Name' value={userForm.values.lastname} onChange={userForm.handleChange} onValidate={userForm.handleValidate} disabled={!isChangingName} />
                        {isChangingName ?
                            <Button variant='secondary' type='submit' onClick={() => { setIsChangingName(false); }} label='Save' />
                            :
                            <Button variant='secondary' onClick={() => { setIsChangingName(true); }} label="Edit" disabled={isChangingEmail || isChangingPass} />
                        }
                        {hasError && <Paragraph style={{ color: Colors.error }}>Invalid name change</Paragraph>}
                    </View>
                </Form>

                <Form handleSubmit={userForm.handleSubmit}>
                    <View container flexDirection='row' alignItems='center' padding='10px' gap='16px'>
                        <Heading text='Email:' renderAs='h3' />
                        <TextField name='email' type='text' value={userForm.values.email} onChange={userForm.handleChange} onValidate={userForm.handleValidate} disabled={!isChangingEmail} />
                        {isChangingEmail ?
                            <Button variant='secondary' type='submit' onClick={() => { setIsChangingEmail(false); }} label='Save' />
                            :
                            <Button variant='secondary' onClick={() => { setIsChangingEmail(true); }} label='Edit' disabled={isChangingName || isChangingPass} />
                        }
                        {hasError && <Paragraph style={{ color: Colors.error }}>Invalid email change</Paragraph>}
                    </View>
                </Form>
                
                {isChangingPass ?
                    <Form handleSubmit={passwordForm.handleSubmit}>
                        <View container flexDirection='row' alignItems='center' padding='10px' gap='16px'>
                            <Heading text='New Password:' renderAs='h3' />
                            <TextField name='password' type='password' value={passwordForm.values.password} onChange={passwordForm.handleChange} onValidate={passwordForm.handleValidate} disabled={!isChangingPass} />
                            <Button variant='secondary' type='submit' label='Save' />
                            <Button variant='secondary' onClick={() => { setIsChangingPass(false); }} label='Cancel' />
                        </View>
                    </Form>
                    :
                    <Button variant='secondary' onClick={() => { setIsChangingPass(true); }} label="Change Password" disabled={isChangingName || isChangingEmail} />
                }
            </View>
        </View>
    );
}