import React, { useContext } from 'react'
import { NavBarContext } from './NavBarContext'


const NavBarToggler = () => {

   const {display_dropdown,setDisplayDropdown} = useContext(NavBarContext)

   return (
      <div className="nav_hamburger hide-md"
         data-nav-open={display_dropdown}
         aria-controls="nav" 
         onClick={() => setDisplayDropdown(!display_dropdown)}>
      </div> 
   )
}

export default NavBarToggler