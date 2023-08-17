import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { NavBarContext } from './NavBarContext'



const MainNavBarLinks = () => {

   const { setDisplayDropdown } = useContext(NavBarContext)
   const active_link_classes = "border-b border-slate-400 pb-1 "

   return (
      <ul className="flex flex-col md:flex-row justify-start gap-5 p-0.5">
         <li>
            <NavLink to="/" 
            onClick={() => setDisplayDropdown(false)}
            className={({ isActive }) => isActive ? active_link_classes : ""}
               >Home</NavLink>
         </li>
         <li>
            <NavLink to="/projects" onClick={() => setDisplayDropdown(false)}
            className={({ isActive }) => isActive ? active_link_classes : ""}>Projects</NavLink>
         </li>
         <li>
            <NavLink to="/search" onClick={() => setDisplayDropdown(false)}
            className={({ isActive }) => isActive ? active_link_classes : ""}>Search</NavLink>
         </li>               
      </ul>
   )
}

export default MainNavBarLinks