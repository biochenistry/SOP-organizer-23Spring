import { useNavigate } from "react-router";
import View from "../components/View/View";
import { gql, useQuery, useMutation } from '@apollo/client'
import { useAuthState } from "../components/Auth";
import Button from "../components/Button/Button";
import Heading from "../components/Heading/Heading";
import ConfirmModal from "../components/modals/ConfirmModal";
import Paragraph from "../components/Paragraph/Paragraph";
import ModalLauncher from "../components/modals/ModalLauncher";
import { useState } from "react";

const GET_ALL_USERS = gql`
query getAllUsers {
    all{
        id
        firstName
        lastName
        username
        isDisabled
        isAdmin
    }
}
`;

const MAKE_ADMIN = gql`
mutation changeUserRole($userId: ID!, $admin: Boolean!){
    user: changeUserRole(userId: $userId, admin: $admin){
        id
        firstName
        lastName
        username
        isAdmin
    }
}
`

const REMOVE_USER = gql`
mutation deleteUser($userId: ID!){
    success: deleteUser(userId: $userId)
}
`

type RemoveUserResponse = {
  success: boolean;
}

type RemoveUserInput = {
  userId: string;
}

type MakeAdminResponse = {
  user: User;
}

type MakeAdminInput = {
  userId: string;
  admin: boolean;
}


type GetAllUsersResponse = {
  all: User[] | null;
}


type User = {
  id: string,
  firstName: string;
  lastName: string;
  username: string;
  isDisabled: boolean;
  isAdmin: boolean;
}

const UsersList: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { state } = useAuthState();
  const [userEdited, setUserEdited] = useState<string | null>(null);
  const { data, refetch: refetchUsers } = useQuery<GetAllUsersResponse>(GET_ALL_USERS, {
    fetchPolicy: "network-only"
  });
  const [makeAdmin, { loading: isMakeAdminLoading }] = useMutation<MakeAdminResponse>(MAKE_ADMIN);
  const [removeUser, { loading: isRemoveUserLoading }] = useMutation<RemoveUserResponse>(REMOVE_USER);

  const handleChangeRole = async (values: MakeAdminInput) => {
    setUserEdited(values.userId);

    await makeAdmin({
      variables: {
        userId: values.userId,
        admin: values.admin,
      },
    });

    setUserEdited(null);
  }

  const handleRemoveUser = async (values: RemoveUserInput) => {
    setUserEdited(values.userId);

    await removeUser({
      variables: {
        userId: values.userId,
      },
    });

    setUserEdited(null);

    await refetchUsers();
  }

  const confirmDeleteUserModal = (
    <ConfirmModal title='Delete User?' onConfirm={handleRemoveUser} confirmLabel='Delete'>
      <Paragraph>Are you sure you want to delete this user? The user's account will be permanently deleted.</Paragraph>
    </ConfirmModal>
  );


  if (!state.user?.isAdmin) {
    navigate('/');
  }

  return (
    <>
      <View container flexDirection='column' padding='24px' gap='32px' maxWidth='1400px' width='100%'>
        <View container flexDirection='row' justifyContent='space-between'>
          <Heading text='Users' renderAs='h1' />
          <Button label='Add User' href='/users/add' variant='primary' />
        </View>
        <View container flexDirection='column' gap='48px'>
          <table>
            <thead>
              <tr>
                <th style={{ width: '200px' }}>First Name</th>
                <th style={{ width: '200px' }}>Last Name</th>
                <th style={{ width: '250px' }}>Username</th>
                <th style={{ width: '200px' }}>Role</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.all?.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.username}</td>
                    <td>{user.isAdmin ? 'Admin' : 'Standard User'} </td>
                    <td>
                      <Button label={user.isAdmin ? 'Change to Standard User' : 'Change to Admin'} variant='tertiary' onClick={() => { handleChangeRole({ userId: user.id, admin: !user.isAdmin }) }} isLoading={isMakeAdminLoading && user.id === userEdited} disabled={user.id === state.user?.id} />
                    </td>
                    <td>
                      <ModalLauncher modal={confirmDeleteUserModal}>
                        {({ openModal }) => (
                          <Button label='Remove' variant='tertiary' type='submit' onClick={() => { openModal({ userId: user.id }) }} isLoading={isRemoveUserLoading && user.id === userEdited} disabled={user.id === state.user?.id} />
                        )}
                      </ModalLauncher>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </View>
      </View>
    </>
  );
}
export default UsersList;