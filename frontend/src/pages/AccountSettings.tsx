import React from 'react';
import View from "../components/View/View";
import Button from "../components/Button/Button";
import Heading from '../components/Heading/Heading';
import Form from '../components/Form/Form';
import useForm from "../components/Form/useForm";
import TextField from '../components/TextField/TextField';
import { useAuthState } from "../components/Auth";
import { useState } from 'react';

type NameInput = {
    firstName: string;
    lastName: string;
}

type EmailInput = {
    email: string;
}

type PasswordInput = {
    password: string;
}

export default function AccountSettings() {
    const { state } = useAuthState();
    const [isChangingName, setIsChangingName] = useState<boolean>(false);
    const [isChangingEmail, setIsChangingEmail] = useState<boolean>(false);
    const [isChangingPass, setIsChangingPass] = useState<boolean>(false);

    const nameForm = useForm<NameInput>({
        initialValues: {
            firstName: state.user?.firstName != null ? state.user?.firstName : '',
            lastName: state.user?.lastName != null ? state.user?.lastName : ''
        },
        onSubmit: () => console.log("Tmp Name Submit"),
    });

    const emailForm = useForm<EmailInput>({
        initialValues: {
            email: state.user?.email != null ? state.user?.email : ''
        },
        onSubmit: () => console.log("Tmp Email Submit"),
    });

    const passwordForm = useForm<PasswordInput>({
        initialValues: {
            password: ''
        },
        onSubmit: () => console.log("Tmp Password Submit"),
    });

    return (
        <View container flexDirection='column' padding='24px' width='100%'>
            <Heading text='Account Settings' renderAs='h1' />
            <View container flexDirection='column' alignItems='center' justifyContent='center' gap='20px' height='100%' width='100%'>
                <Form handleSubmit={nameForm.handleSubmit}>
                    <View container flexDirection='row' alignItems='center' padding='10px' gap='16px'>
                        <Heading text='Name:' renderAs='h3' />
                        <TextField name='firstName' type='text' description='First Name' value={nameForm.values.firstName} onChange={nameForm.handleChange} onValidate={nameForm.handleValidate} disabled={!isChangingName} />
                        <TextField name='lastName' type='text' description='Last Name' value={nameForm.values.lastName} onChange={nameForm.handleChange} onValidate={nameForm.handleValidate} disabled={!isChangingName} />
                        {isChangingName ?
                            <Button variant='secondary' type='submit' onClick={() => { setIsChangingName(false); }} label='Save' />
                            :
                            <Button variant='secondary' onClick={() => { setIsChangingName(true); }} label="Edit" />
                        }
                    </View>
                </Form>

                <Form handleSubmit={emailForm.handleSubmit}>
                    <View container flexDirection='row' alignItems='center' padding='10px' gap='16px'>
                        <Heading text='Email:' renderAs='h3' />
                        <TextField name='email' type='text' value={emailForm.values.email} onChange={emailForm.handleChange} onValidate={emailForm.handleValidate} disabled={!isChangingEmail} />
                        {isChangingEmail ?
                            <Button variant='secondary' type='submit' onClick={() => { setIsChangingEmail(false); }} label='Save' />
                            :
                            <Button variant='secondary' onClick={() => { setIsChangingEmail(true); }} label='Edit' />
                        }
                    </View>
                </Form>

                <Form handleSubmit={passwordForm.handleSubmit}>
                    <View container flexDirection='row' alignItems='center' padding='10px' gap='16px'>
                        <Heading text='Password:' renderAs='h3' />
                        <TextField name='password' type='password' value={passwordForm.values.password} onChange={passwordForm.handleChange} onValidate={passwordForm.handleValidate} disabled={!isChangingPass} />
                        {isChangingPass ?
                            <Button variant='secondary' type='submit' onClick={() => { setIsChangingPass(false); }} label='Save' />
                            :
                            <Button variant='secondary' onClick={() => { setIsChangingPass(true); }} label="Edit" />
                        }
                    </View>
                </Form>
            </View>
        </View>
    );
}