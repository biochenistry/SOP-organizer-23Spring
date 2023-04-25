import { gql, useMutation } from "@apollo/client";
import Form from "../components/Form/Form";
import useForm from "../components/Form/useForm";
import TextField from "../components/TextField/TextField";
import View from "../components/View/View";
import { useEffect, useState } from "react";
import Paragraph from "../components/Paragraph/Paragraph";
import { Colors } from "../components/GlobalStyles";
import { useAuthState } from "../components/Auth";
import { useNavigate } from "react-router";
import Button from "../components/Button/Button";
import Heading from "../components/Heading/Heading";

const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  success: login(username: $username, password: $password)
}
`;

type LoginResponse = {
  success: boolean;
}

type LoginInput = {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { state } = useAuthState();
  const [login, { loading }] = useMutation<LoginResponse>(LOGIN, { errorPolicy: 'all' });
  const [hasError, setHasError] = useState<boolean>(false);

  const handleLogin = async (values: LoginInput) => {
    const { data } = await login({
      variables: {
        username: values.username,
        password: values.password,
      },
    });

    if (data?.success) {
      window.location.reload();
    } else {
      setHasError(true);
    }
  }

  const loginForm = useForm<LoginInput>({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: handleLogin,
  });

  useEffect(() => {
    if (state.user) {
      navigate('/');
    }
  }, [state, navigate]);

  return (
    <View container alignItems='center' justifyContent='center' height='100%' width='100%'>
      <View container flexDirection='column' gap='32px' style={{ minWidth: '400px', maxWidth: '600px' }} >
        
        <View container flexDirection='column' gap='8px'>
          <Heading text='Welcome Back!' renderAs='h1' />
          <Paragraph style={{ color: Colors.textSecondary }}>Please login to your account to continue.</Paragraph>
        </View>
        
        <Form handleSubmit={loginForm.handleSubmit}>
          <View container gap='16px' flexDirection='column'>
            <TextField label='Username' name='username' type='text' value={loginForm.values.username} error={loginForm.errors.firstName} onChange={loginForm.handleChange} onValidate={loginForm.handleValidate} required />
            <TextField label='Password' name='password' type='password' value={loginForm.values.password} error={loginForm.errors.firstName} onChange={loginForm.handleChange} onValidate={loginForm.handleValidate} required />
            {hasError && <Paragraph style={{ color: Colors.error }}>Invalid username or password</Paragraph>}
            <Button label='Login' variant='primary' type='submit' style={{ width: '100%' }} isLoading={loading} />
          </View>
        </Form>
      </View>
    </View>
  );
}