import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { SidebarData } from './SidebarData'



const Sidebar: React.FunctionComponent = () => {
    const [close, setClose] = useState(true)
    const showSidebar = () => setClose(!close)
    return (
        <>
        <SidebarMenu close={close}>
            {SidebarData.map((item, index) => {
                return (
                    <MenuItems key={index}>
                        <span style={{marginLeft: '16px'}}>{item.title}</span>

                    </MenuItems>
                )
            })}
        </SidebarMenu>
        </>
    )
}
export default Sidebar

const Navbar = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    height: 3.5rem;
    background-color: #000080;
`
const MenuItems = styled.li`
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 90px;
    padding: 1rem 0 1.25rem;
`

const SidebarMenu = styled.div<{close: boolean}>`
    width: 100px;
    height: 100vh;
    background-color: #000080;
    position: fixed;
    top: 0;
    left: ${({ close}) => close ? '0' : '-100%'};
    transition: .6s;
`