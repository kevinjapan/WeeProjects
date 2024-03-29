import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../../App/AppContext/AppContext'
import { Notifications } from '../../Utility/utilities/enums'
import reqInit from '../../Utility/RequestInit/RequestInit'
import NavBar from '../../App/NavBar/NavBar'
import Modal from '../../Utility/Modal/Modal'
import {get_db_ready_datetime} from '../../Utility/DateTime/DateTime'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { PencilIcon } from '@heroicons/react/24/solid'
import EditTodoForm from '../EditTodoForm/EditTodoForm'
import DeleteTodoForm from '../DeleteTodoForm/DeleteTodoForm'
import get_ui_ready_date from '../../Utility/DateTime/DateTime'
import CheckList from '../../CheckList/CheckList'
import CommentsList from '../../Comments/CommentsList'



const TodoCard = props => {
   
   const [todo,setTodo] = useState(props.todo)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   const [checked,setChecked] = useState(false)
   const [local_status,setLocalStatus] = useState('')
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)

   useEffect(() => { 
      setTodo(props.todo)
   },[props.todo])

   useEffect(() => { 
      props.todo.done_at === null ? setChecked(false) : setChecked(props.todo.done_at)
   },[props.todo.done_at])


   const update_todo = async(formJson) => {

      // eslint-disable-next-line
      let clear_message // prev. comment prevents warning ("clear_message not used.."")

      try {
         setLocalStatus(Notifications.UPDATING)

         // future : 
         // make endpoints clearer here? (rather than trying to match a url route each time - open to errors)

         const data = await fetch(`${api}/${props.project_slug}/${props.task_slug}/todos/${todo.slug}`,reqInit("PUT",bearer_token,formJson))
         const jsonData = await data.json()
         

         if(jsonData.outcome === Notifications.SUCCESS) {

            // update local copy of Todo
            setTodo(formJson) 

            // update local copy of parent Task
            props.update_todo(formJson)
         }

         setLocalStatus(Notifications.DONE)
         
         setLocalStatus('')
      }
      catch(error) {
         setLocalStatus(Notifications.FAILED_CONNECTION)
         setStatusMsg('Sorry, we are unable to update data on the server at this time.' + error)
      }
      setShowEditModal(false)
   }

   const confirm_delete_todo = () => {
      setShowEditModal(false)
      setShowDeleteModal(true)
   }

   const delete_todo = async (formJson) => {

      // for future : retain 'formJson' and 'todo' - no benefit to throw the data away

      let date = new Date()                                    
      todo['deleted_at'] = get_db_ready_datetime(date)

      try {
         setLocalStatus(Notifications.UPDATING)
         const data = await fetch(`${api}/${props.project_slug}/${props.task_slug}/${todo.slug}`,reqInit("DELETE",bearer_token,todo))
         const jsonData = await data.json()
         

         if(jsonData.outcome === Notifications.SUCCESS) {
            // update local copy of parent Task
            props.remove_deleted_todo(todo.id)
            close_todo()
         }

         setLocalStatus(Notifications.DONE)
         
         setLocalStatus('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_SERVER_UPDATE + error)
      }
      setShowDeleteModal(false)
   }

   const close_todo = () => {
      setTodo({})
   }

   const title_classes = 'p-0.5 cursor-pointer text-slate-600 hover:text-slate-800 leading-tight'
   const border_color = 'border-blue-200'

   return (
      todo.title ?

         <section className="border border-gray-400 rounded-lg p-1 shadow-lg">
      
            <NavBar title={props.todo.title} >
               <ul className="flex flex-row w-full">
                  <li>
                     <StyledButton aria-label="Edit this task." onClicked={() => setShowEditModal(true)}>
                        <PencilIcon style={{width:'16px',height:'16px'}}/>Edit
                     </StyledButton>
                  </li>
                  {/* 
                  <li>
                     <div onClick={() => close_todo()} className="float-right mr-2 p-2 cursor-pointer text-lg" >X</div>
                  </li> 
                  */}
               </ul>
            </NavBar>

            <section>
               <span className="italic px-2 text-gray-300">task id: {todo.task_id}</span>
            </section>

            <section className={`flex flex-col gap-2 m-2 mt-0 p-2 `}>
               {props.todo.outline
                  ? <p className="text-gray-700 whitespacing-pre" style={{whiteSpace:'pre-line'}}>{props.todo.outline}</p>
                     : <p className="italic text-gray-500" >This todo has no description.</p>}
            </section>

            {/* only show solution if populated (if relevant) */}
            {props.todo.solution
               ?  <section className={`flex flex-col gap-2 border border-gray-400 rounded m-2 p-2 ${border_color}`}>
                     <label>Solution</label>
                     <p className="text-gray-700" style={{whiteSpace:'pre-line'}}>{props.todo.solution}</p>
                  </section>
               :  null
            }

            <section className={`flex flex-col gap-2 border border-gray-400 rounded m-2 p-2 ${border_color}`}>
               <div>created: {get_ui_ready_date(props.todo.created_at)}</div>
               <div>last updated:{get_ui_ready_date(props.todo.updated_at)}</div>
               <div>author:{props.todo.author_id}</div>
            </section>

            {todo.has_checklist
               ?  <CheckList 
                     todo_id={todo.id}
                     project_slug={props.project_slug}
                     task_slug={props.task_slug}
                     todo_slug={todo.slug}
                  />
               :  null
            }

            <CommentsList 
               commentable_type="todo"
               commentable_id={props.todo.id}
               comments={props.todo.comments} 
            />

            {show_edit_modal && (
               <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
                  <EditTodoForm 
                     todo={todo} 
                     is_unique={props.is_unique}
                     close_modal={() => setShowEditModal(false)}
                     onSubmit={update_todo} 
                     onDelete={confirm_delete_todo}
                  />
               </Modal>
            )}

            {show_delete_modal && (
               <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
                  <DeleteTodoForm 
                     todo_id={todo.id} 
                     onSubmit={delete_todo} 
                     close_modal={() => setShowDeleteModal(false)}
                  />
               </Modal>
            )}

         </section>
      : null
   )
}

export default TodoCard