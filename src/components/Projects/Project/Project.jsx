import React, { useState,useEffect,useContext,useReducer } from 'react'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import NavBar from '../../App/NavBar/NavBar'
import projectReducer from './projectReducer'
import TasksList from '../../Tasks/TasksList/TasksList'
import Modal from '../../Utility/Modal/Modal'
import EditProjectForm from '../EditProjectForm/EditProjectForm'
import DeleteProjectForm from '../DeleteProjectForm/DeleteProjectForm'
import AddTaskForm from '../../Tasks/AddTaskForm/AddTaskForm'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { PencilIcon,TrashIcon } from '@heroicons/react/24/solid'
import CommentsList from '../../Comments/CommentsList'



const Project = props => {

   const [project, dispatch] = useReducer(projectReducer, props.project)
   const {api,bearer_token,setStatusMsg } = useContext(AppContext)
   const [show_add_task_modal,setShowAddTaskModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const [show_edit_modal,setShowEditModal] = useState(false)

   const add_task = async (formJson) => {
      try {
         const data = await fetch(`${api}/${project.slug}/tasks`,reqInit("POST",bearer_token,formJson))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === 'success') {
               formJson['id'] = jsonData.id
               formJson['slug'] = formJson.title.replace(/ /g,'-')
               dispatch({
                  type: 'add_task',
                  task: formJson
               })
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
         await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === 'success') {
            dispatch({
               type: 'update_project',
               project: formJson
            })
               
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
      console.log("woohoo")
      setShowEditModal(false)
      setShowDeleteModal(true)
   }
   
   const delete_project = async () => {
      try {
         const data = await fetch(`${api}/projects`,reqInit("DELETE",bearer_token,project))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === 'success') {
               dispatch({
                  type: 'delete_project_local_copy'
               })
         }
      } catch(error) {
         setStatusMsg('Sorry, we are unable to update data on the server at this time.' + error)
      }
   }

   const is_unique = (item_id,item_field,value) => {
      if(!project.tasks) return true
      const filtered_tasks = project.tasks.filter(task => parseInt(task.id) !== parseInt(item_id))
      return filtered_tasks ? !filtered_tasks.some(task => task[item_field] === value) : true
   }

   return (
      project && project.id ?
         <>
            <NavBar title={project.title} title_tag="h1" title_link={`/projects/${project.title}`} classes="">
               <ul className="flex flex-row">
                  <li>
                     <StyledButton aria-label="Edit this project." onClicked={() => setShowEditModal(true)}>
                        <PencilIcon style={{width:'16px',height:'16px'}}/>Edit
                     </StyledButton>
                  </li>
               </ul>
            </NavBar>

            <TasksList 
               project_slug={project.slug} 
               project={project}
               refresh_project={props.refresh_project}
               setShowAddTaskModal={setShowAddTaskModal} 
            />

            <section className="my-16 mx-auto w-fit border border-gray-400 rounded p-1 pt-0 shadow-lg"> 
               <CommentsList 
                  title_tag="h1"
                  commentable_type="project"
                  commentable_id={props.project.id}
                  comments={props.project.comments} 
               />
            </section>

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