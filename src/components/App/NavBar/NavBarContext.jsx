import { useState,createContext } from 'react'


export const NavBarContext = createContext()


export const NavBarProvider = props => {

   // NavBarContext state
   const [display_dropdown,setDisplayDropdown] = useState(false)

   return (
      <NavBarContext.Provider value={{display_dropdown,setDisplayDropdown}}>
         {props.children}
      </NavBarContext.Provider>
   )
}