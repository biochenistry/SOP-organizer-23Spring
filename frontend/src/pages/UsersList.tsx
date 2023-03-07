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


/*
TODO- find query that gets all users -not made yet, that is okay
-find a way to list them 
*/

type GetAllUsersResponse = {
    users: User[];
}

type User = {
    id: string,
    firstName: string;
    lastName: string;
    email: string;
    isDisabled: boolean;
    isAdmin: boolean;
}
/*

*/

/*
const Page: React.FunctionComponent = () => {
    const { data } = useQuery<GetAllUsersResponse>(GET_ALL_USERS);

    var user_a:User=[id='a',firstName='b',lastName='c',email='d', isDisabled=true, isAdmin=true]
*/

export default function Page() {
    //temporary users until query exists
    const userA: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'jd@gmail',
        isDisabled: false,
        isAdmin: true,
    }
    const userB: User = {
        id: '2',
        firstName: 'Sally',
        lastName: 'Lu',
        email: 'sl@aol',
        isDisabled: true,
        isAdmin: false,
    }

    var user_list:User[]=[userA, userB];

    user_list.forEach(User => {
        
    });

    return (
        <View container alignItems='center' justifyContent='center' width='100%'>
        
        {user_list.map((User) => {
          return (
            <li>{User.firstName} {User.email}  
            </li>
          );
        })}

        </View> 
        
    );
}  
  