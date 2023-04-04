import React from 'react';
import View from "../components/View/View";
import Button from "../components/Button/Button";
import Heading from '../components/Heading/Heading';
import Form from '../components/Form/Form';
import useForm from "../components/Form/useForm";
import TextField from '../components/TextField/TextField';
import { useAuthState } from "../components/Auth";
import { gql, useMutation } from "@apollo/client";
import Paragraph from '../components/Paragraph/Paragraph';
import { Colors } from '../components/GlobalStyles';
import { login } from '../components/Auth/authStateReducer';
import { useNavigate } from 'react-router';

const UPDATE_USER = gql`
mutation updateUser($userId: ID!, $firstname: String!, $lastname: String!, $email: String!) {
  updateUser(userId: $userId, firstname: $firstname, lastname: $lastname, email: $email) {
    id
    firstName
    lastName
    email
  }
}
`;

const UPDATE_PASS = gql`
mutation changePassword($userId: ID!, $newPassword: String!) {
  success: changePassword(userId: $userId, newPassword: $newPassword)
}
`;

type UpdateUserResponse = {
  user: User;
}

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
  const navigate = useNavigate();
  const { state, dispatch } = useAuthState();
  const [updateUser, { loading: updateUserIsLoading, data: updateUserData, reset: resetUpdateUser }] = useMutation<UpdateUserResponse>(UPDATE_USER, { errorPolicy: 'all' });
  const [changePassword, { loading: changePasswordIsLoading, data: changePasswordData, reset: resetChangePassword }] = useMutation<UpdateUserResponse>(UPDATE_PASS, { errorPolicy: 'all' });

  /* Runs when the user submits profile changes */
  const handleUserUpdate = async (values: UserInput) => {
    await updateUser({
      variables: {
        userId: state.user?.id,
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
      },
    });

    if (state.user) {
      dispatch(login({
        ...state.user,
        firstName: values.firstname,
        lastName: values.lastname,
        email: values.email,
      }));
    }

    setTimeout(() => {
      resetUpdateUser();
    }, 3000);
  }

  /* Runs when the user submits a password change */
  const handlePassUpdate = async (values: PasswordInput) => {
    await changePassword({
      variables: {
        userId: state.user?.id,
        newPassword: values.password,
      },
    });

    setTimeout(() => {
      resetChangePassword();
    }, 3000);
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

  if (!state.user) {
    navigate('/');
  }

  return (
    <View container flexDirection='column' padding='24px' gap='32px'>
      <Heading text='Account Settings' renderAs='h1' />
      <View container flexDirection='column' gap='48px'>

        <View container flexDirection='column' gap='16px'>
          <Heading text='Profile Info' renderAs='h2' />
          <Form handleSubmit={userForm.handleSubmit}>
            <View container flexDirection='column' gap='16px'>
              <View container flexDirection='row' gap='16px'>
                <TextField name='firstname' type='text' label='First Name' value={userForm.values.firstname} error={userForm.errors.firstname} onChange={userForm.handleChange} onValidate={userForm.handleValidate} required />
                <TextField name='lastname' type='text' label='Last Name' value={userForm.values.lastname} error={userForm.errors.lastname} onChange={userForm.handleChange} onValidate={userForm.handleValidate} required />
              </View>
              <TextField name='email' type='text' label='Email' value={userForm.values.email} error={userForm.errors.email} onChange={userForm.handleChange} onValidate={userForm.handleValidate} required />
              <View container alignItems='center' flexDirection='row' gap='16px'>
                <Button variant='primary' type='submit' label='Save Changes' style={{ maxWidth: 'fit-content' }} isLoading={updateUserIsLoading} disabled={userForm.hasError} />
                {(!updateUserIsLoading && updateUserData) && <Paragraph style={{ color: Colors.textSecondary }}>Changes saved!</Paragraph>}
              </View>
            </View>
          </Form>
        </View>

        <View container flexDirection='column' gap='16px'>
          <Heading text='Change Password' renderAs='h2' />
          <Form handleSubmit={passwordForm.handleSubmit}>
            <View container flexDirection='column' gap='16px'>
              <View container flexDirection='row' alignItems='center' gap='16px'>
                <TextField name='password' type='password' label='New Password' value={passwordForm.values.password} error={passwordForm.errors.password} onChange={passwordForm.handleChange} onValidate={passwordForm.handleValidate} required />
              </View>
              <View container alignItems='center' flexDirection='row' gap='16px'>
                <Button variant='primary' type='submit' label='Change Password' style={{ maxWidth: 'fit-content' }} isLoading={changePasswordIsLoading} disabled={passwordForm.hasError} />
                {(!changePasswordIsLoading && changePasswordData) && <Paragraph style={{ color: Colors.textSecondary }}>Password changed!</Paragraph>}
              </View>
            </View>
          </Form>
        </View>
      </View>
    </View>
  );
}