import React from 'react'
import {IoIosSearch} from 'react-icons/io'
import View from '../View/View'

const Searchbar: React.FunctionComponent = () => {
    
    return (
        <View padding='0 0 4px 0'>
            <div>
                <input type = "text" className = "input" placeholder="Search..." />
                    <button>Search</button>            
            </div>
        </View>
    )
}

export default Searchbar;