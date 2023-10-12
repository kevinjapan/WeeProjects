import React, { useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import NavBar from '../../App/NavBar/NavBar'
import TasksList from '../../Tasks/TasksList/TasksList'
import Modal from '../../Utility/Modal/Modal'
import {get_db_ready_datetime} from '../../Utility/DateTime/DateTime'
import EditProjectForm from '../EditProjectForm/EditProjectForm'
import DeleteProjectForm from '../DeleteProjectForm/DeleteProjectForm'
import AddTaskForm from '../../Tasks/AddTaskForm/AddTaskForm'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { PencilIcon } from '@heroicons/react/24/solid'



const Project = props => {

   const [project, setProject] = useState(props.project)
   const {api,bearer_token,setStatusMsg } = useContext(AppContext)
   const [show_add_task_modal,setShowAddTaskModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_welcome,setShowWelcome] = useState(true)

   const add_task = async (formJson) => {
      try {
         const data = await fetch(`${api}/${project.slug}/tasks`,reqInit("POST",bearer_token,formJson))
         const jsonData = await data.json()
         
         if(jsonData.outcome === 'success') {
            formJson['id'] = jsonData.id
            formJson['slug'] = formJson.title.replace(/ /g,'-')

            let modified = {...project}
            if(modified){
               if(!modified.tasks.some(task => task.id === action.task.id)) {
                  modified.tasks.unshift(action.task)
               }
            }
            setProject(modified)
         }
         else {
            setStatusMsg("Server couldn't add a new Task")
         }
      } catch (error){
         setStatusMsg('Sorry, we are unable to update data on the server at this time. ' + error)
      }
      setShowAddTaskModal(false)
   }

   const update_project = async(formJson) => {
      try {
         const data = await fetch(`${api}/projects/${project.slug}`,reqInit("PUT",bearer_token,formJson))
         const jsonData = await data.json()
         
         if(jsonData.outcome === 'success') {
            setProject({...formJson})               
            props.update_project_in_list(formJson)
         }
         else {
            setStatusMsg("Server couldn't update Project")
         }
      } catch (error){
         setStatusMsg('Sorry, we are unable to update data on the server at this time. ' + error)
      }
      setShowEditModal(false)
   }

   const confirm_delete_project = () => {
      setShowEditModal(false)
      setShowDeleteModal(true)
   }
   
   const delete_project = async () => {

      // currently, we simply provide a datetimestamp from client for 'deleted_at'
      // - there are no requirements for synchronizing multiple users / UTC etc.

      let date = new Date()                                    
      project['deleted_at'] = get_db_ready_datetime(date)

      try {
         const data = await fetch(`${api}/projects`,reqInit("DELETE",bearer_token,project))
         const jsonData = await data.json()
         

         if(jsonData.outcome === 'success') {

            const deleted_project_id = project.id
            setProject({})
            
            // refresh list in Projects component once project is deleted
            props.removed_deleted_project(deleted_project_id)
         } 
         else {
            setStatusMsg(jsonData.message ? jsonData.message : "Sorry, we couldn't retrieve the Projects.")
         }
      } catch(error) {
         setStatusMsg('Sorry, we are unable to update data on the server at this time.' + error)
      }
   }

   const is_unique = (item_id,item_field,value) => {
      if(!project.tasks) return true
      // exclude selected Project from check (we may simply be renaming)
      const filtered_tasks = project.tasks.filter(task => parseInt(task.id) !== parseInt(item_id))
      // check no other Project has that field value already
      return filtered_tasks ? !filtered_tasks.some(task => task[item_field] === value) : true
   }

      
   

   return (
      project && project.id ?
         <>
            <NavBar title={project.title} title_tag="h1" title_link={`/projects/${project.slug}`} title_callback={() => setShowWelcome(true)} classes="">
               <ul className="flex flex-row items-center gap-5">
                  <li>
                     <Link to={`/projects/${project.slug}/messageboard`} className="text-blue-600">MessageBoard</Link>
                  </li>
                  <li>
                     <StyledButton aria-label="Edit this project." onClicked={() => setShowEditModal(true)}>
                        <PencilIcon style={{width:'16px',height:'16px'}}/>Edit
                     </StyledButton>
                  </li>
               </ul>
            </NavBar>

            <TasksList
               show_welcome={show_welcome}
               project_slug={project.slug} 
               project={project}
               refresh_project={props.refresh_project}
               setShowAddTaskModal={setShowAddTaskModal} 
               setShowWelcome={setShowWelcome}
            />

            {show_edit_modal && (
               <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
                  <EditProjectForm 
                     onSubmit={update_project} 
                     is_unique={props.is_unique} 
                     project={project} 
                     setShowDeleteModal={setShowDeleteModal}
                     onDelete={confirm_delete_project} 
                     close_modal={() => setShowEditModal(false)}
                  />
               </Modal>
            )}

            {show_delete_modal && (
               <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
                  <DeleteProjectForm 
                     onSubmit={delete_project} 
                     close_modal={() => setShowDeleteModal(false)} 
                  />
               </Modal>
            )}
               
            {show_add_task_modal && (
               <Modal show={show_add_task_modal} close_modal={() => setShowAddTaskModal(false)}>
                  <AddTaskForm 
                     onSubmit={add_task} 
                     is_unique={is_unique} 
                     close_modal={() => setShowAddTaskModal(false)}  
                  />
               </Modal>
            )}   

         </>
      :   <div className="m-3">
               The project was succesfully deleted.
               Back to <a href='/projects'>Projects List.</a>
         </div>
   )
}

export default Project