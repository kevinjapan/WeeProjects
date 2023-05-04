import React, { useContext } from 'react'
import { NavBarContext } from './NavBarContext'


const NavBarSm = props => {

    const { display_dropdown } = useContext(NavBarContext)

    return (
        <div className={`navbar_links_wrap_init hide-md ${display_dropdown ? 'nav_droppeddown' : ''}`} > 
            <div className={`navbar_links_wrap ${display_dropdown ? 'nav_droppeddown' : ''}`}>
                <div className={`navbar_links ${display_dropdown ? 'nav_droppeddown' : ''}`}>
                    {props.children}
                </div>
            </div>
        </div>   
    )
}

export default NavBarSm