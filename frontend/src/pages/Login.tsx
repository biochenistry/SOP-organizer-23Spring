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

const LOGIN = gql`
mutation login($email: String!, $password: String!) {
  success: login(email: $email, password: $password)
}
`;

type LoginResponse = {
  success: boolean;
}

type LoginInput = {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { state } = useAuthState();
  const [login] = useMutation<LoginResponse>(LOGIN, { errorPolicy: 'all' });
  const [hasError, setHasError] = useState<boolean>(false);

  const handleLogin = async (values: LoginInput) => {
    const { data } = await login({
      variables: {
        email: values.email,
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
      email: '',
      password: ''
    },
    onSubmit: handleLogin,
  });

  useEffect(() => {
    if (state.user) {
      navigate('/');
    }
  }, [state]);

  return (
    <View container alignItems='center' justifyContent='center' width='100%'>
      <View container>
        <Form handleSubmit={loginForm.handleSubmit}>
          <View container gap='16px' flexDirection='column'>
            <TextField label='Email' name='email' type='text' value={loginForm.values.email} error={loginForm.errors.firstName} onChange={loginForm.handleChange} onValidate={loginForm.handleValidate} />
            <TextField label='Password' name='password' type='password' value={loginForm.values.password} error={loginForm.errors.firstName} onChange={loginForm.handleChange} onValidate={loginForm.handleValidate} />
            {hasError && <Paragraph color={Colors.error}>Invalid email or password</Paragraph>}
            {/* TODO: Update to button component */}
            <button type='submit'>Login</button>
          </View>
        </Form>
      </View>
    </View>
  );
}