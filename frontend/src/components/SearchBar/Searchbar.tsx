import React from 'react'
import View from '../View/View'
import TextField from '../TextField/TextField';
import Button from '../Button/Button';
import { gql, useQuery } from '@apollo/client';

const Searchbar: React.FunctionComponent = () => {
    return (
        <View container padding='0 8px 8px 0' gap='4px'>
            <TextField placeholder='Search...' name='searchBar' type='text' />
            <Button label='Search' variant='primary' type='submit' style={{width: '50%'}} />
        </View>
    )
}

export default Searchbar;