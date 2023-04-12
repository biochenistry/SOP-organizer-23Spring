import View from "../components/View/View";
import { gql, useMutation } from "@apollo/client";
import Button from "../components/Button/Button";
import Form from "../components/Form/Form";
import useForm from "../components/Form/useForm";
import TextField from "../components/TextField/TextField";


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
  username: string;
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
  const [createUser, { data }] = useMutation<CreateUserResponse>(ADD_USER, { errorPolicy: 'all' });

  const handleCreateUser = async (values: CreateUserInput) => {
    await createUser({
      variables: {
        firstname: values.firstname,
        lastname: values.lastname,
        username: values.username,
        password: values.password,
        admin: values.admin,
      },
    });
  }

  const createUserForm = useForm<CreateUserInput>({
    initialValues: {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      admin: false,
    },
    onSubmit: handleCreateUser,
  });

  //plug in the new info-runs when a new user is returned, so remind them to add the user to google drive
  //issue that user does not reload
  if (data?.user) {
    return (
      <p>Don't forget to add the user to the google folder!</p>
    );
  }


  //Returns a form to fill out users information
  return (
    <View container alignItems='center' justifyContent='center' width='100%' flexDirection="column">
      <Button label='Cancel' href='/users' variant='secondary' onDark type='submit' style={{ width: '20%' }} />

      <View>
        <Form handleSubmit={createUserForm.handleSubmit}>
          <View container gap='8px' flexDirection="column">
            <TextField label='First Name' name='firstname' type='text' value={createUserForm.values.firstname} error={createUserForm.errors.firstname} onChange={createUserForm.handleChange} onValidate={createUserForm.handleValidate} required />
            <TextField label='Last Name' name='lastname' type='text' value={createUserForm.values.lastname} error={createUserForm.errors.lastname} onChange={createUserForm.handleChange} onValidate={createUserForm.handleValidate} required />
            <TextField label='Username' name='username' type='text' value={createUserForm.values.username} error={createUserForm.errors.username} onChange={createUserForm.handleChange} onValidate={createUserForm.handleValidate} required />
            <TextField label='Password' name='password' type='text' value={createUserForm.values.password} error={createUserForm.errors.password} onChange={createUserForm.handleChange} onValidate={createUserForm.handleValidate} required />
            <Button label='CreateUser' variant='primary' type='submit' />
          </View>
        </Form>
      </View>
    </View>
  );
}
