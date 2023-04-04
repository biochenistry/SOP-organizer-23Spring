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
    - add confirmation/error message after changes are saved
*/

export default function AccountSettings() {
    const { state } = useAuthState();
    const [updateUser] = useMutation<UpdateUserResponse>(UPDATE_USER, { errorPolicy: 'all' });
    const [changePassword] = useMutation<UpdatePassResponse>(UPDATE_PASS, { errorPolicy: 'all' });
    // const [hasError, setHasError] = useState<boolean>(false);
    const [isChangingInfo, setIsChangingInfo] = useState<boolean>(false);
    const [isChangingPass, setIsChangingPass] = useState<boolean>(false);
    const [submitEditsDisabled, setSubmitEditsDisabled] = useState<boolean>(true);

    const handleUserUpdate = async (values: UserInput) => {
        const { data } = await updateUser({
            variables: {
                userId: state.user?.id,
                firstname: values.firstname !== '' ? values.firstname : state.user?.firstName,
                lastname: values.lastname !== '' ? values.lastname : state.user?.lastName,
                email: values.email !== '' ? values.email : state.user?.email,
            },
        });

        if (!data?.success) {
            // setHasError(true);
        }

        setIsChangingInfo(false);
        setSubmitEditsDisabled(true);
    }

    const handlePassUpdate = async (values: PasswordInput) => {
        const { data } = await changePassword({
            variables: {
                userId: state.user?.id,
                newPassword: values.password,
            },
        });

        if (!data?.success) {
            // setHasError(true);
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
                           <TextField name='password' type='password' onChange={passwordForm.handleChange} onValidate={passwordForm.handleValidate} />
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
                                <TextField name='firstname' type='text' description='First Name' placeholder={userForm.values.firstname} onChange={userForm.handleChange} onValidate={userForm.handleValidate} disabled={!isChangingInfo} />
                                <TextField name='lastname' type='text' description='Last Name' placeholder={userForm.values.lastname} onChange={userForm.handleChange} onValidate={userForm.handleValidate} disabled={!isChangingInfo} />
                            </View>
                            <View container flexDirection='row' alignItems='center' justifyContent='center' padding='10px' gap='16px'>
                                <Heading text='Email:' renderAs='h3' />
                                <TextField name='email' type='text' placeholder={userForm.values.email} onChange={userForm.handleChange} onValidate={userForm.handleValidate} disabled={!isChangingInfo} />
                            </View>
                            {isChangingInfo ?
                                <View container flexDirection='row' alignItems='center' justifyContent='center' padding='10px' gap='12px'>
                                    <Button variant='secondary' type='submit' label='Save Changes' disabled={submitEditsDisabled} />
                                    <Button variant='secondary' onClick={() => { setIsChangingInfo(false); }} label="Cancel" />
                                </View>
                                :
                                <View container flexDirection='row' alignItems='center' justifyContent='center' padding='10px' gap='12px'>
                                    <Button variant='secondary' onClick={() => { setIsChangingInfo(true); setTimeout(() => setSubmitEditsDisabled(false), 500); }} label="Edit Profile" />
                                    <Button variant='secondary' onClick={() => { setIsChangingPass(true); }} label="Change Password" />
                                </View>
                            }
                        </Form>
                    </View>
                }
            </View>
        </View>
    );
}