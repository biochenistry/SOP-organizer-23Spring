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
mutation updateUser($userId: ID!, $firstname: String!, $lastname: String!) {
  updateUser(userId: $userId, firstname: $firstname, lastname: $lastname) {
    id
    firstName
    lastName
  }
}
`;

const UPDATE_PASS = gql`
mutation changePassword($currentPassword: String!, $newPassword: String!) {
  success: changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
}
`;

type UpdateUserResponse = {
  user: User;
}

type User = {
  id: string;
  firstName: string;
  lastName: string;
}

type UserInput = {
  firstname: string;
  lastname: string;
}

type PasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
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
      },
    });

    if (state.user) {
      dispatch(login({
        ...state.user,
        firstName: values.firstname,
        lastName: values.lastname,
      }));
    }

    setTimeout(() => {
      resetUpdateUser();
    }, 3000);
  }

  /* Runs when the user submits a password change */
  const handleChangePassword = async (values: PasswordInput) => {
    if (values.newPassword !== values.confirmNewPassword) {
      return;
    }
    
    await changePassword({
      variables: {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
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
    },
    onSubmit: handleUserUpdate,
  });

  const passwordForm = useForm<PasswordInput>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    onSubmit: handleChangePassword,
  });

  if (!state.user) {
    navigate('/');
  }

  return (
    <View container flexDirection='column' padding='24px' gap='32px' maxWidth='600px'>
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
            <View container flexDirection='column' gap='16px' maxWidth='400px'>
              <View container flexDirection='column' alignItems='flex-start' gap='16px'>
                <TextField name='currentPassword' type='password' label='Current Password' value={passwordForm.values.currentPassword} error={passwordForm.errors.currentPassword} onChange={passwordForm.handleChange} onValidate={passwordForm.handleValidate} required style={{ width: '100%' }} />
                <TextField name='newPassword' type='password' label='New Password' value={passwordForm.values.newPassword} error={passwordForm.errors.newPassword} onChange={passwordForm.handleChange} onValidate={passwordForm.handleValidate} required style={{ width: '100%' }} />
                <TextField name='confirmNewPassword' type='password' label='Confirm New Password' value={passwordForm.values.confirmNewPassword} error={passwordForm.errors.confirmNewPassword} onChange={passwordForm.handleChange} onValidate={passwordForm.handleValidate} required style={{ width: '100%' }} />
                {(passwordForm.values.newPassword !== passwordForm.values.confirmNewPassword) && <Paragraph style={{ color: Colors.error }}>Passwords do not match</Paragraph>}
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