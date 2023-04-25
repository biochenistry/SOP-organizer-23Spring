import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import View from './components/View/View';
import { Route, Routes } from 'react-router';
import Login from './pages/Login';
import FileView from './pages/FileView';
import UsersList from './pages/UsersList';
import AddUser from './pages/AddUser';
import Home from './pages/Home';
import AccountSettings from './pages/AccountSettings';
import { useAuthState } from './components/Auth';
import AutoOpen from './components/modals/AutoOpen';
import FormModal from './components/modals/FormModal';
import { gql, useMutation } from '@apollo/client';
import ModalLauncher from './components/modals/ModalLauncher';
import TextField from './components/TextField/TextField';
import { login } from './components/Auth/authStateReducer';

const RESET_PASSWORD = gql`
mutation resetPassword($newPassword: String!) {
  success: resetPassword(newPassword: $newPassword)
}
`;

type ChangePasswordResponse = {
  success: boolean;
}

type ChangePasswordInput = {
  password: String;
  confirmPassword: String;
}

function App() {
  const { state, dispatch } = useAuthState();
  const [changePassword] = useMutation<ChangePasswordResponse>(RESET_PASSWORD);

  const handleChangePassword = async (values: ChangePasswordInput) => {
    if (!state.user) {
      return;
    }

    if (values.password !== values.confirmPassword) {
      return;
    }

    const { data } = await changePassword({
      variables: {
        newPassword: values.password
      },
    });

    if (data?.success) {
      dispatch(login({
        ...state.user,
        shouldForcePasswordChange: false,
      }));
    }
  }

  const changePasswordModal = (
    <FormModal<ChangePasswordInput> title='Change Password' onSubmit={handleChangePassword} submitLabel='Change Password' initialValues={{ password: '', confirmPassword: '' }} showCloseButton={false} showCancelButton={false} >
      <View container gap='16px' flexDirection='column' >
        <TextField label='Password' name='password' type='password' required />
        <TextField label='Confirm Password' name='confirmPassword' type='password' required />
      </View>
    </FormModal>
  );

  return (
    <>
      {state.user?.shouldForcePasswordChange &&
        <ModalLauncher modal={changePasswordModal}>
          {({ openModal }) => (
            <AutoOpen openModal={openModal} />
          )}
        </ModalLauncher >
      }

      <Routes>
        <Route path='/' element={<WithHeaderAndSidebar><Home /></WithHeaderAndSidebar>} />
        <Route path='/login' element={<WithHeaderAndSidebar><Login /></WithHeaderAndSidebar>} />
        <Route path='/file/:fileId' element={<WithHeaderAndSidebar><FileView /></WithHeaderAndSidebar>} />
        <Route path='/users' element={<WithHeaderAndSidebar><UsersList /></WithHeaderAndSidebar>} />
        <Route path='/users/add' element={<WithHeaderAndSidebar><AddUser /></WithHeaderAndSidebar>} />
        <Route path='/account-settings' element={<WithHeaderAndSidebar><AccountSettings /></WithHeaderAndSidebar>} />
      </Routes>
    </>
  );
}

type WithHeaderAndSidebarProps = {
  children: React.ReactNode;
}

function WithHeaderAndSidebar(props: WithHeaderAndSidebarProps) {
  return (
    <>
      <Header />
      <View container flexDirection='row' height='calc(100vh - 76px)' style={{ overflow: 'scroll' }}>
        <Sidebar />
        <View style={{ height: '100%', overflow: 'scroll', width: '100%' }}>
          {props.children}
        </View>
      </View>
    </>
  )
}

export default App;
