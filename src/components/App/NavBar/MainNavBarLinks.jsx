import React, { useContext } from 'react'
import { AppContext } from '../AppContext/AppContext'
import { NavBarContext } from './NavBarContext'
import { NavLink } from 'react-router-dom'



const MainNavBarLinks = () => {

   const { bearer_token,user_name } = useContext(AppContext)
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
         {bearer_token
            ?  <>
                  <li><NavLink to="/user_account" onClick={() => setDisplayDropdown(false)}
                           className={({ isActive }) => isActive ? `${active_link_classes}` : ``}>{user_name}</NavLink></li>
                  <li><NavLink to="/login" onClick={() => setDisplayDropdown(false)}
                           className={({ isActive }) => isActive ? active_link_classes : ""}>Logout</NavLink></li>
               </>
               
            :  <li>
                  <NavLink to="/login" onClick={() => setDisplayDropdown(false)}
                           className={({ isActive }) => isActive ? active_link_classes : ""}>Login</NavLink>
               </li>
         }

         {/* to do : alternate above w/ Logout link depending on login status.. */}

         {/* <li>
            <NavLink to="/search" onClick={() => setDisplayDropdown(false)}
            className={({ isActive }) => isActive ? active_link_classes : ""}>Search</NavLink>
         </li>                */}
      </ul>
   )
}

export default MainNavBarLinks