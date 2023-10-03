import React from 'react'
import { Routes,Route,Link } from 'react-router-dom'
import DashboardHome from '../DashboardHome/DashboardHome'
import ArtefactManager from '../ArtefactManager/ArtefactManager'
import UsersManager from '../UsersManager/UsersManager'

const Dashboard = () => {
   return (
      <>

         <ul className="flex gap-5 p-2 px-5 items-end">
            <li><Link to={`/dashboard`} className="text-blue-600 text-2xl font-bold">DASHBOARD</Link></li>
            <li><Link to={`/dashboard/artefacts`} className="text-blue-600">Manage Artefacts</Link></li>
            <li><Link to={`/dashboard/users`} className="text-blue-600">Manage Users</Link></li>
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

            <Route path="/users/*" 
               element={
                  <UsersManager  
                  />
               }
            />

         </Routes>
      </>
   )
}

export default Dashboard