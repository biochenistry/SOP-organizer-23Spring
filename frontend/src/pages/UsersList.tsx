import { useNavigate } from "react-router";
import View from "../components/View/View";
import { gql, useQuery } from '@apollo/client'
import { useAuthState } from "../components/Auth";
import Button from "../components/Button/Button";

//TODO: Button to each row to remove user
//Button in each row to upgrade user to admin
//button to add a user, pop up
//info button explaining what everything is

//query defined in backend
const GET_ALL_USERS = gql`
query getAllUsers {
    all{
        id
        firstName
        lastName
        email
        isDisabled
        isAdmin
    }
}
`;

type GetAllUsersResponse = {
    all: User[] | null;
}

type User = {
    id: string,
    firstName: string;
    lastName: string;
    email: string;
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

//allows admin users to access user information
const Page: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const { state } = useAuthState();
    const { data } = useQuery<GetAllUsersResponse>(GET_ALL_USERS);

    if (!state.user?.isAdmin) {
        navigate('/');
    }

    //Returns a table with each user's information
    return (      
        <View container alignItems='center' justifyContent='center' width='100%'>
        <table>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Admin?</th>
            </tr>
            {data?.all?.map((user) => {
                    return(
                    <tr>
                        <td>{user.firstName}</td> 
                        <td>{user.lastName}</td> 
                        <td>{user.email}</td> 
                        <td>{determineAdmin(user)} </td> 
                        <td>
                            <Button label='Remove' href='/login' variant='secondary' onDark type='submit' style={{ width: '100%' }} />
                        </td>
                        
                    </tr>
                    );
                })}

        </table>
        </View> 
    );
}  
export default Page
  