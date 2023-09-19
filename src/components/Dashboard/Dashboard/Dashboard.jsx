import React from 'react'
import { Routes,Route,Link } from 'react-router-dom'
import DashboardHome from '../DashboardHome/DashboardHome'
import ArtefactManager from '../ArtefactManager/ArtefactManager'

const Dashboard = () => {
   return (
      <>

         <ul className="flex gap-5 p-2 px-5 items-end">
            <li><Link to={`/dashboard`} className="text-blue-600 text-xl">Dashboard</Link></li>
            <li><Link to={`/dashboard/artefacts`} className="text-blue-600">Manage Artefacts</Link></li>
         </ul>
         


         <Routes>

            <Route path="/" 
               element={
                  <DashboardHome 
                  />
               }
            /> 

            <Route path="/artefacts/*" 
               element={
                  <ArtefactManager  
                  />
               }
            />

         </Routes>
      </>
   )
}

export default Dashboard