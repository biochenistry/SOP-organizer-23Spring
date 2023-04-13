import View from "../components/View/View";
import { gql, useMutation } from "@apollo/client";
import Button from "../components/Button/Button";
import Form from "../components/Form/Form";
import useForm from "../components/Form/useForm";
import TextField from "../components/TextField/TextField";
import Heading from "../components/Heading/Heading";
import Paragraph from "../components/Paragraph/Paragraph";
import { ROOT_FOLDER_ID } from "..";
import { useAuthState } from "../components/Auth";
import { useNavigate } from "react-router";

const ADD_USER = gql`
mutation createUser($firstname: String!, $lastname: String!, $username: String!, $password: String!, $admin: Boolean!){
    user: createUser(firstname: $firstname, lastname: $lastname, username: $username, password: $password, admin: $admin){
        firstName
        lastName
        username
        isAdmin
    }
}
`;

type CreateUserResponse = {
  user: User;
}

type CreateUserInput = {
  firstname: string;
  lastname: string;
  password: string;
  admin: boolean;
}

type User = {
  id: string,
  firstName: string;
  lastName: string;
  username: string;
  isDisabled: boolean;
  isAdmin: boolean;
}

export default function AddUser() {
  const navigate = useNavigate();
  const { state } = useAuthState();
  const [createUser, { data }] = useMutation<CreateUserResponse>(ADD_USER, { errorPolicy: 'all' });

  const handleCreateUser = async (values: CreateUserInput) => {
    await createUser({
      variables: {
        firstname: values.firstname,
        lastname: values.lastname,
        username: values.firstname.toLowerCase() + '_' + values.lastname.toLowerCase(),
        password: values.password,
        admin: values.admin,
      },
    });
  }

  const createUserForm = useForm<CreateUserInput>({
    initialValues: {
      firstname: '',
      lastname: '',
      password: '',
      admin: false,
    },
    onSubmit: handleCreateUser,
  });

  if (!state.user?.isAdmin) {
    navigate('/');
  }

  //plug in the new info-runs when a new user is returned, so remind them to add the user to google drive
  //issue that user does not reload
  if (data?.user) {
    return (
      <View container flexDirection='column' padding='24px' gap='32px' maxWidth='1200px' width='100%'>
        <View container flexDirection='row' justifyContent='space-between'>
          <Heading text='User succesfully created!' renderAs='h1' />
        </View>
        <View container flexDirection='column' gap='48px' maxWidth='400px'>
          <View container flexDirection='column' gap='24px'>
            <Heading renderAs='h3' text='Login Information' />
            <View container flexDirection='column' gap='8px'>
              <Paragraph style={{ fontWeight: 'bold' }}>Username</Paragraph>
              <Paragraph>{createUserForm.values.firstname.toLowerCase() + '_' + createUserForm.values.lastname.toLowerCase()}</Paragraph>
            </View>
            <View container flexDirection='column' gap='8px'>
              <Paragraph style={{ fontWeight: 'bold' }}>Temporary Password</Paragraph>
              <Paragraph>{createUserForm.values.password}</Paragraph>
            </View>
          </View>

          <View container flexDirection='column' gap='16px'>
            <Heading renderAs='h3' text='Google Drive' />
            <Paragraph>In order for the user to be able to edit documents, you must share the root drive folder with their Google account.</Paragraph>
            <Button label='Open Drive' variant='tertiary' onClick={() => { window.open('https://drive.google.com/drive/folders/' + ROOT_FOLDER_ID); }} />
          </View>

          <Button label='Done' variant='primary' href='/users' />
        </View>
      </View>
    );
  }


  //Returns a form to fill out users information
  return (
    <View container flexDirection='column' padding='24px' gap='32px' maxWidth='1200px' width='100%'>
      <View container flexDirection='row' justifyContent='space-between'>
        <Heading text='Create User' renderAs='h1' />
      </View>
      <View container flexDirection='column' gap='48px' maxWidth='400px'>
        <Form handleSubmit={createUserForm.handleSubmit}>
          <View container gap='16px' flexDirection='column'>
            <TextField label='First Name' name='firstname' type='text' value={createUserForm.values.firstname} error={createUserForm.errors.firstname} onChange={createUserForm.handleChange} onValidate={createUserForm.handleValidate} required />
            <TextField label='Last Name' name='lastname' type='text' value={createUserForm.values.lastname} error={createUserForm.errors.lastname} onChange={createUserForm.handleChange} onValidate={createUserForm.handleValidate} required />
            <TextField label='Temporary Password' name='password' type='password' value={createUserForm.values.password} error={createUserForm.errors.password} onChange={createUserForm.handleChange} onValidate={createUserForm.handleValidate} required />
            <View container gap='16px'>
              <Button label='Cancel' href='/users' variant='secondary' type='submit' />
              <Button label='Create User' variant='primary' type='submit' isLoading={createUserForm.isLoading} />
            </View>
          </View>
        </Form>
      </View>
    </View>
  );
}
