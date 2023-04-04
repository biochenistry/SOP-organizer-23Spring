import React from 'react'
import {IoIosSearch} from 'react-icons/io'

const Searchbar: React.FunctionComponent = () => {
    return (
        <div>
            <input type = "text" className = "input" placeholder="Search..." />
            <button>Search</button>
        </div>
    )
}

export default Searchbar;