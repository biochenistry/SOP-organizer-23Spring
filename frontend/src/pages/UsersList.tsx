import { useNavigate } from "react-router";
import View from "../components/View/View";
import { gql, useQuery, useMutation } from '@apollo/client'
import { useAuthState } from "../components/Auth";
import Button from "../components/Button/Button";
import { StyleSheet, css } from 'aphrodite';
import { Colors } from '../components/GlobalStyles';
import { createStyle } from '../util/createStyle';


const styles = StyleSheet.create({
    usertable: {
        padding: '16px',
        'user-select': 'none',
        ':hover': {
          backgroundColor: Colors.neutralHover,
          cursor: 'pointer',
        },
        ':active': {
          backgroundColor: Colors.neutralActive,
        
        },
    },
    table: {
        backgroundColor: Colors.isuRed,
        borderBottom: `4px solid ${Colors.isuYellow}`,
        color: '#ffffff',
        width: '100%',
        padding: '15px',
    }
});


//query defined in backend
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

function determineAdmin(person: User){
    if (person.isAdmin){
        return "Admin";
    }
    else{
        return "Not Admin";
    }
}

function adminButtonLabel(person: User){
    if(person.isAdmin){
        return "Make User";
    }
    else{
        return "Make Admin";
    }
}



//allows admin users to access user information
const Page: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const { state } = useAuthState();
    const { data, refetch: refetchUsers } = useQuery<GetAllUsersResponse>(GET_ALL_USERS, {
        fetchPolicy: "network-only"
    });
    const [makeAdmin, {loading: isMakeAdminLoading}] = useMutation<MakeAdminResponse>(MAKE_ADMIN);
    const [removeUser, {loading: isRemoveUserLoading}] = useMutation<RemoveUserResponse>(REMOVE_USER);


    
    const handleChangeRole = async (values: MakeAdminInput) => {
        const { data } = await makeAdmin({
          variables: {
            userId: values.userId,
            admin: values.admin,
          },
        });  
    }

    const handleRemoveUser = async (values: RemoveUserInput) => {
        const { data } = await removeUser({
          variables: {
            userId: values.userId,
          },
        });

        await refetchUsers();
    }
    

    if (!state.user?.isAdmin) {
        navigate('/');
    }

    //Returns a table with each user's information
    return (      
        <View container alignItems='center' justifyContent='center' width='100%' flexDirection="column">
        <Button label='Add User' href='/adduser' variant='secondary' onDark type='submit' style={{ width: '20%' }} />

        <table style={{ borderBottom: `4px solid ${Colors.isuYellow}`, width: '80%', padding: '15px', }} >
            <thead>
            <tr>
                <th style={{textAlign: 'left'}}>First Name</th>
                <th style={{textAlign: 'left'}}>Last Name</th>
                <th style={{textAlign: 'left'}}>Username</th>
                <th style={{textAlign: 'left'}}>Admin?</th>
            </tr>
            </thead>
            <tbody>
            {data?.all?.map((user, index) => {
                    return(
                    <tr key={index}>
                        <td>{user.firstName}</td> 
                        <td>{user.lastName}</td> 
                        <td>{user.username}</td> 
                        <td>{determineAdmin(user)} </td> 
                        <td>
                            <Button label='Remove' variant='secondary' onDark type='submit' style={{ width: '100%' }} onClick={()=>{handleRemoveUser({userId: user.id})}} isLoading = {isRemoveUserLoading}/>
                        </td>
                        <td>
                            <Button label={adminButtonLabel(user)} variant='secondary' onDark style={{ width: '100%' }} onClick={()=>{handleChangeRole({userId: user.id, admin: !user.isAdmin })}} isLoading= {isMakeAdminLoading}/>
                        </td>
                    </tr>
                    );
                })}
        </tbody>
        </table>
        </View> 
    );
}  
export default Page