import { useNavigate } from "react-router";
import View from "../components/View/View";
import { gql, useQuery } from '@apollo/client'
import { useAuthState } from "../components/Auth";
import Button from "../components/Button/Button";
import { StyleSheet, css } from 'aphrodite';
import { Colors } from '../components/GlobalStyles';
import { createStyle } from '../util/createStyle';


const Page: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const { state } = useAuthState();

    if (!state.user?.isAdmin) {
        navigate('/');
    }

    //Returns a table with each user's information
    return (      
        <View container alignItems='center' justifyContent='center' width='100%' flexDirection="column">
        <Button label='Cancel' href='/users' variant='secondary' onDark type='submit' style={{ width: '20%' }} />

        
        </View> 
    );
}  
export default Page
  