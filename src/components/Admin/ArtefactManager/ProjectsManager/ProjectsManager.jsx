import React, { useState,useEffect,useContext } from 'react'
import { Routes,Route,Link } from 'react-router-dom'
import { AppContext } from '../../../App/AppContext/AppContext'
import reqInit from '../../../Utility/RequestInit/RequestInit'
import get_ui_ready_date from '../../../Utility/DateTime/DateTime'



const ProjectsManager = () => {

   const [projects,setProjects] = useState([])
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)


   useEffect(() => {
      const get_projects = async(api) => {
         try {
               const data = await fetch(`${api}/projects_inclusive`,reqInit())
               const jsonData = await data.json()

            if(jsonData.outcome === 'success') {
               setProjects(jsonData.data)
            } else {
               setStatusMsg("Server couldn't retrieve Projects")
            }
         } catch(error) {
               setStatusMsg('Sorry, unable to fetch data from the server. ' + error)
         }
      }
      get_projects(api)
   },[api,setStatusMsg])


   return (
      <>

         {/* <Link to={`projects`}>Projects</Link>   to do : provide links into TasksManager for current project */}

         <section className="w-11/12 m-2 mx-10 p-5 border rounded">
            <table className="m-1 w-full">
               <thead className="text-slate-400 font-thin">
                  <tr>
                     <td className="px-3 pt-0.5">title</td>
                     <td className="px-3 pt-0.5">created</td>
                     <td className="px-3 pt-0.5">last update</td>
                     <td className="px-3 pt-0.5">deleted_at</td>
                  </tr>
               </thead>
               <tbody>
                  {projects.map((project) => (
                     <tr key={project.id}>

                        <td className="px-3 pt-0.5"><Link to={`${project.slug}\\tasks`} className="text-blue-600">{project.title}</Link></td>
                        <td className="px-3 pt-0.5">{get_ui_ready_date(project.created_at)}</td>
                        <td className="px-3 pt-0.5">{get_ui_ready_date(project.updated_at)}</td>
                        <td className="px-3 pt-0.5">{project.deleted_at}</td>

                     </tr>
                  ))}
               </tbody>
            </table>
         </section>

         <Routes>
            <Route path="/projects" 
               element={
                  <ProjectsManager 
                  />
               }
            /> 
         </Routes>

      </>
   )
}

export default ProjectsManager