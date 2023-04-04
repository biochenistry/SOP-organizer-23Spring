import React from 'react'

const Searchbar: React.FunctionComponent = () => {
    return (
        <div>
            <input type = "text" className = "input" placeholder="Search..." />
            <ul></ul>
        </div>
    )
}

export default Searchbar;