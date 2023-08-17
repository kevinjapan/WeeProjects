import React, { lazy,Suspense } from 'react'
import { Routes,Route,Outlet } from 'react-router-dom'
import Home from '../../Home/Home'


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
         <main className="px-4 min-h-screen">
            <Routes>
               <Route path="/" element={<AppWrap />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects/*" element={<Projects />} />
                  <Route path="/search" element={<Search />} />
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
      <Suspense fallback={<h6 className="text-center text-slate-300 mt-24">Loading...</h6>}>
         <Outlet />
      </Suspense>
   )
}

export default AppLayout