import React from 'react'
import NavBar from '../NavBar/NavBar'
import MainNavBarLinks from '../NavBar/MainNavBarLinks'


const AppHeader = () => {
   return (
      <header className=" w-full left-0 top-0 p-1 px-3 pb-2 bg-neutral-100">
         <NavBar title="weeprojects" title_link="/" classes="text-2xl font-bold">
               <MainNavBarLinks></MainNavBarLinks>
         </NavBar>
      </header>
    )
}

export default AppHeader