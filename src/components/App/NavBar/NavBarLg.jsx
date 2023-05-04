import React from 'react'


const NavBarLg = props => {
   return (
      <div className={`navbar_links nav_droppeddown hide show-md`}>
         {props.children}
      </div>
   )
}

export default NavBarLg