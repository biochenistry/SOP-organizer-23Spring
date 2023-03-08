import View from "../components/View/View";
import { gql, useQuery } from '@apollo/client'


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
    all: User[];
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

const Page: React.FunctionComponent = () => {
    const { data } = useQuery<GetAllUsersResponse>(GET_ALL_USERS);
    return (      
        <View container alignItems='center' justifyContent='center' width='100%'>
        <table>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Admin?</th>
            </tr>
            {data?.all.map((user) => {
                    return(
                    <tr>
                        <td>{user.firstName}</td> 
                        <td>{user.lastName}</td> 
                        <td>{user.email}</td> 
                        <td>{determineAdmin(user)} </td> 
                    </tr>
                    );
                })}

        </table>
        </View> 
    );
}  
export default Page
  