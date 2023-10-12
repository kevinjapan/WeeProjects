import React, { lazy,Suspense } from 'react'
import { Routes,Route,Outlet } from 'react-router-dom'
import Home from '../../Home/Home'
import Login from '../Login/Login'
import Logout from '../Logout/Logout'
import UserAccount from '../../UserAccount/UserAccount'
import Dashboard from '../../Dashboard/Dashboard/Dashboard'


const Projects = lazy(() => import("../../Projects/Projects"))   
const Search = lazy(() => import("../../Search/Search"))      

import AppHeader from '../AppHeader/AppHeader'
import AppFooter from '../AppFooter/AppFooter'
import AppStatus from '../AppStatus/AppStatus'


// -----------------------------------------------------------------------------------
// for testing lazy loading and suspense :
// const Search = lazy(() => wait(1000).then(() => import("../../Search/Search")))
// 
// function wait(time) {
//    return new Promise(resolve => {
//       setTimeout(resolve,time)
//    })
// }
// -----------------------------------------------------------------------------------



const AppLayout = () => {
   return (
      <>
         <AppHeader/>
         <main className="min-h-screen">
            <Routes>
               <Route path="/" element={<AppWrap />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects/*" element={<Projects />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/user_account/*" element={<UserAccount />} />
                  <Route path="/dashboard/*" element={<Dashboard />} />
                  <Route path="/login/*" element={<Login />} />
                  <Route path="/logout/*" element={<Logout />} />
               </Route>
            </Routes>
         </main>
         <AppFooter/>
         <AppStatus/>
      </>
   )
}

// simple wrap to enable Suspense.
function AppWrap() {
   return (
      <Suspense fallback={<h6 className="text-center text-slate-400 mt-24">Loading...</h6>}>
         <Outlet />
      </Suspense>
   )
}

export default AppLayout