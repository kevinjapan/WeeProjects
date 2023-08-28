import React, { useState,useEffect,useReducer,useContext } from 'react'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import taskcardReducer from './taskcardReducer'
import TodosList from '../../Todos/TodosList/TodosList'
import NavBar from '../../App/NavBar/NavBar'
import Modal from '../../Utility/Modal/Modal'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import get_ui_ready_date from '../../Utility/Dates/Dates'
import EditTaskForm from '../EditTaskForm/EditTaskForm'
import DeleteTaskForm from '../DeleteTaskForm/DeleteTaskForm'
import { PencilIcon,TrashIcon } from '@heroicons/react/24/solid'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import SessionsList from '../../Sessions/SessionsList'



const TaskCard = props => {

   const [task, dispatch] = useReducer(taskcardReducer, {})
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   useEffect(() => {
      dispatch({
         type: 'load',
         task: props.task
      })
   })   

   useEffect(() => {
      dispatch({
         type: 'update_task',
         task: props.task
      })
   },[props.task])

   const check_todo = () => {
      dispatch({
         type: 'check_todo'
      })
   }

   const update_todos = updated_todos => {
     let modified = {...task}
     modified.todos = updated_todos
     dispatch ({
         type:'load',
         task: modified
     })
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
               // dispatch({
               //    type: 'update_task',
               //    task: formJson
               // })
               setStatusMsg('task updated')
               props.update_list()
         }
         else {
            setStatusMsg("Server couldn't update Task")
         }
      }
      catch (err){
         setStatusMsg('Sorry, we are unable to update data on the server at this time. ' + err)
      }
      setShowEditModal(false)
   }
   
   return (
      task.title ?
      <>
         <li key={task.id}
            className="flex-1 border rounded p-1 px-2 min-h-screen list-none  shadow-lg"
            >

            {/* <h5 className="text-2xl mb-5">{task.title}</h5> */}

            <NavBar title={task.title} >
               <ul className="flex flex-row w-full">
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

            
            <SessionsList 
               sessionable_type="task"
               sessionable_id={props.task.id}
               sessions={props.task.sessions} />


            <div className="flex justify-between pt-2 px-2">
               {get_ui_ready_date(task.created_at)}
               {task.pin ? <BookmarkIcon style={{width:'16px',height:'16px'}}/> : null}
            </div>

            <TodosList 
               project_slug={props.project_slug} 
               task_slug={props.task.slug} 
               task_id={props.task.id}
               todos={task.todos}
               check_todo={check_todo}
               update_todos={update_todos}
               view_todo_details={props.view_todo_details}
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
      : null
   )
}

export default TaskCard