import React, { useState,useEffect,useContext } from 'react'
import { Routes,Route,Link } from 'react-router-dom'
import { AppContext } from '../../../App/AppContext/AppContext'
import reqInit from '../../../Utility/RequestInit/RequestInit'
import { Notifications } from '../../../Utility/utilities/enums'
import get_ui_ready_date from '../../../Utility/DateTime/DateTime'
import Modal from '../../../Utility/Modal/Modal'
import EditProjectManagerForm from './EditProjectManagerForm/EditProjectManagerForm'
import DeleteProjectManagerForm from './DeleteProjectManagerForm/DeleteProjectManagerForm'
import StyledButton from '../../../Utility/StyledButton/StyledButton'
import { TrashIcon } from '@heroicons/react/24/solid'



const ProjectsManager = () => {

   const [projects,setProjects] = useState([])
   const [selected_project,setSelectedProject] = useState({})
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const [local_status,setLocalStatus] = useState('')

   useEffect(() => {
      const get_projects = async(api) => {
         try {
            const data = await fetch(`${api}/projects_inclusive`,reqInit("GET",bearer_token))
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


   const confirm_delete_project = () => {
      setShowEditModal(false)
      setShowDeleteModal(true)
   }

   const delete_project = async (formJson) => {

      try {
         setLocalStatus(Notifications.UPDATING)
   
         const data = await fetch(`${api}/projects/delete_permanently`,reqInit("DELETE",bearer_token,selected_project))

         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))

         if(jsonData.outcome === Notifications.SUCCESS) {

            // we don't reset this - we don't mind that form contains prev Todo - it's not accessible
            // setSelectedProject({})

            // refresh UI list
            let modified = projects.filter((project) => project.id !== selected_project.id)
            setProjects(modified)

         }

         setLocalStatus(Notifications.DONE)
         await new Promise(resolve => setTimeout(resolve, 1000))
         setLocalStatus('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_SERVER_UPDATE + error)
      }
      setShowDeleteModal(false)
   }

   const edit_project = project => {
      setSelectedProject(project)
      setShowEditModal(true)
   }

   return (
      <>
         <h6 className="text-slate-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</h6>

         <section className="w-11/12 m-2 mx-10 p-5 border rounded">
            <table className="m-1 w-full">
               <thead className="text-slate-400 font-thin">
                  <tr>
                     <td className="px-3 pt-0.5">title</td>
                     <td className="px-3 pt-0.5">created</td>
                     <td className="px-3 pt-0.5">last update</td>
                     <td className="px-3 pt-0.5">deleted_at</td>
                     <td></td>
                  </tr>
               </thead>
               <tbody>
                  {projects.map((project) => (
                     <tr key={project.id} className="border-b hover:bg-yellow-100 cursor-default">

                        <td className="px-3 pt-0.5"><Link to={`${project.slug}\\tasks`} className="text-blue-600">{project.title}</Link></td>
                        <td className="px-3 pt-0.5">{get_ui_ready_date(project.created_at)}</td>
                        <td className="px-3 pt-0.5">{get_ui_ready_date(project.updated_at)}</td>
                        <td className="px-3 pt-0.5">{get_ui_ready_date(project.deleted_at)}</td>

                        <td>
                           <div onClick={() => edit_project(project)} className="text-blue-600 cursor-pointer">edit</div>
                           {/* <StyledButton aria-label="Edit this project." onClicked={() => setShowEditModal(true)}>
                              <TrashIcon style={{width:'16px',height:'16px'}}/>Permanently Delete
                           </StyledButton> */}
                        </td>
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

         {show_edit_modal && (
               <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
                  <EditProjectManagerForm 
                     project={selected_project}
                     close_modal={() => setShowEditModal(false)}
                     // onSubmit={update_project} 
                     onDelete={confirm_delete_project}
                  />
               </Modal>
            )}
         {show_delete_modal && (
               <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
                  <DeleteProjectManagerForm 
                     project_id={selected_project.id} 
                     onSubmit={delete_project} 
                     close_modal={() => setShowDeleteModal(false)}
                  />
               </Modal>
            )}
      </>
   )
}

export default ProjectsManager