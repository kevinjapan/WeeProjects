import React, { useState,useEffect,useReducer,useContext } from 'react'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import taskslistitemReducer from './taskslistitemReducer'
import TodosList from '../../Todos/TodosList/TodosList'
import NavBar from '../../App/NavBar/NavBar'
import Modal from '../../Utility/Modal/Modal'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import EditTaskForm from '../EditTaskForm/EditTaskForm'
import DeleteTaskForm from '../DeleteTaskForm/DeleteTaskForm'
import { PencilIcon,TrashIcon } from '@heroicons/react/24/solid'



const TasksListItem = props => {

   const [task, dispatch] = useReducer(taskslistitemReducer, {})
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   useEffect(() => {
      dispatch({
         type: 'load',
         task: props.task
      })
   })

   const check_todo = () => {
      dispatch({
         type: 'check_todo'
      })
   }

   const update_todos = updated_todos => {
     props.update_task_todos(task.id,updated_todos)
   }

   const delete_task = async () => {
      try {
         const data = await fetch(`${api}/${props.project_slug}/tasks`,reqInit("DELETE",bearer_token,task))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === 'success') {
               props.remove_deleted_task(task.id)
         }
      }
      catch(error) {
         setStatusMsg('Sorry, we are unable to update data on the server at this time.' + error)
      }
   }

   const update_task = async(formJson) => {
      try {
         const data = await fetch(`${api}/${props.project_slug}/tasks/${task.slug}`,reqInit("PUT",bearer_token,formJson))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === 'success') {
               dispatch({
                  type: 'update_task',
                  task: formJson
               })
               props.update_task(task.id,formJson)
               setStatusMsg('task updated')
         }
         else {
            console.log("Server couldn't update Task")
         }
      }
      catch (err){
         setStatusMsg('Sorry, we are unable to update data on the server at this time. ' + err)
      }
      setShowEditModal(false)
   }
   
   return (
      <>
         <li key={task.id}
            className="flex-1 border rounded p-1 px-2 min-h-screen"
            style={{minWidth:'300px',maxWidth:'47.5%'}}
            >

            {/* <h5 className="text-2xl mb-5">{task.title}</h5> */}

            <NavBar title={task.title} >
               <ul className="flex flex-row">
                  <li>
                     <StyledButton aria-label="Delete this task." onClicked={() => setShowDeleteModal(true)}>
                        <TrashIcon style={{width:'16px',height:'16px'}}/>Delete
                     </StyledButton>
                  </li>
                  <li>
                     <StyledButton aria-label="Edit this task." onClicked={() => setShowEditModal(true)}>
                        <PencilIcon style={{width:'16px',height:'16px'}}/>Edit
                     </StyledButton>
                  </li>
               </ul>
            </NavBar>

            <TodosList 
               project_slug={props.project_slug} 
               task_slug={props.task.slug} 
               todos={task.todos}
               check_todo={check_todo}
               update_todos={update_todos}
               />
               
            {show_edit_modal && (
               <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
                  <EditTaskForm 
                     onSubmit={update_task} 
                     task={task} 
                     is_unique={props.is_unique} 
                     close_modal={() => setShowEditModal(false)}/>
               </Modal>
            )}
            {show_delete_modal && (
               <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
                  <DeleteTaskForm onSubmit={delete_task} close_modal={() => setShowDeleteModal(false)}/>
               </Modal>
            )}
         </li>
      </>
   )
}

export default TasksListItem