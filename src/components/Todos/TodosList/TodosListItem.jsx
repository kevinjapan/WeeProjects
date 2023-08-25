import React, { useState,useEffect,useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../App/AppContext/AppContext'
import { datetimestamp } from '../../Utility/Dates/Dates'
import { Notifications } from '../../Utility/utilities/enums'
import reqInit from '../../Utility/RequestInit/RequestInit'
import Modal from '../../Utility/Modal/Modal'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import EditTodoForm from '../EditTodoForm/EditTodoForm'
import DeleteTodoForm from '../DeleteTodoForm/DeleteTodoForm'
import { BookmarkIcon } from '@heroicons/react/24/outline'



const TodosListItem = props => {

   const [todo,setTodo] = useState(props.todo)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   const [checked,setChecked] = useState(false)
   const [local_status,setLocalStatus] = useState('')
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)

   useEffect(() => { 
      props.todo.done_at === null ? setChecked(false) : setChecked(props.todo.done_at)
   },[props.todo.done_at])

   const check_todo = async(modified_todo) => {
      setLocalStatus(Notifications.UPDATING)

      // we could update on-the-fly - but if server fails, costly to preserve prev. done_at 
      // so we wait and let props.update_list() call refresh the list
      // props.check_todo(modified_todo)

      // update server
      update_todo(modified_todo)
   }


   // we use Todo.<EditTodoForm>
   const update_todo = async(formJson) => {

      // eslint-disable-next-line
      let clear_message // prev. comment prevents warning ("clear_message not used.."")
      try {
         setLocalStatus(Notifications.UPDATING)
         const data = await fetch(`${api}/${props.project_slug}/${props.task_slug}/todos/${todo.slug}`,reqInit("PUT",bearer_token,formJson))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === Notifications.SUCCESS) {
            setTodo(formJson)
            props.update_list()
         }
         setLocalStatus(Notifications.DONE)
         await new Promise(resolve => setTimeout(resolve, 1000))
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
      try {
         setLocalStatus(Notifications.UPDATING)
         const data = await fetch(`${api}/${props.project_slug}/${props.task_slug}/${todo.slug}`,reqInit("DELETE",bearer_token,todo))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === Notifications.SUCCESS) {
            props.remove_deleted_todo(todo.id)
         }
         setLocalStatus(Notifications.DONE)
         await new Promise(resolve => setTimeout(resolve, 1000))
         setLocalStatus('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_SERVER_UPDATE + error)
      }
      setShowEditModal(false)
   }

   const view_todo_details = () => {
      props.view_todo_details(todo)
   }

   let item_classes = 'w-full border rounded px-1 py-0.5 '
   let title_classes = 'p-0.5 cursor-pointer hover:bg-yellow-200 leading-tight'
   if(parseInt(props.selected_todo_id) === todo.id) {
      item_classes += ' border-blue-900'
   }

   return (
      <>
         <li key={props.todo.id} className={`${item_classes} ${todo.on_going && !checked > 0 ? 'bg-yellow-200' : ''}`} >
            <div className="flex justify-between gap-1 items-center w-full m-0">

               {todo.pin 
                  ?  <BookmarkIcon style={{width:'16px',height:'16px',opacity:'.7'}}/> 
                  :  <BookmarkIcon style={{width:'16px',height:'16px',opacity:'.3'}}/> 
               }
            
               {/* list_item checkbox */}
               <input type="checkbox" checked={checked || false}
                  onChange={e => {
                     check_todo({
                        ...todo,
                        done_at: e.target.checked ? datetimestamp() : null,
                        pin:0,
                        on_going:0,
                     }) 
                  }}
               />

               {/* title */}
               <div className="w-full">
                  <div className={`${title_classes} ${checked ? 'line-through text-zinc-400 hover:text-zinc-600' : ''} `} 
                     onClick={() => view_todo_details()}>{todo.title}</div>
               </div>
               {/* <div className="w-full">
                  <div className={`${title_classes} ${checked ? 'line-through text-zinc-400 hover:text-zinc-600' : ''} `} 
                     onClick={() => setShowEditModal(true)}>{todo.title}</div>
               </div> */}

               {/* open the Todo item view */}
               {/* <StyledButton aria-label="Delete this task." onClicked={() => view_todo_details()}>
                  <BookOpenIcon style={{width:'16px',height:'16px'}}/>View
               </StyledButton> */}

               {/* retain for option to open in separate window..
                <div>
                  <Link to={`/projects/${props.project_slug}/${props.task_slug}/${todo.slug}`}>
                     <StyledButton aria-label="Open todo.">
                        <BookOpenIcon style={{width:'12px',height:'12px'}}/>View
                     </StyledButton>
                  </Link>
               </div> */}
            </div>
               
            {/* status dropdown */}
            {local_status ? <div className="w-full text-slate-400 text-sm">{local_status}</div> : <div></div>}
         </li>

         {/* {show_edit_modal && (
            <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
               <EditTodoForm 
                  onSubmit={update_todo} 
                  onDelete={confirm_delete_todo} 
                  todo={todo} 
                  is_unique={props.is_unique}
                  close_modal={() => setShowEditModal(false)}/>
            </Modal>)} */}

         {show_delete_modal && (
            <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
               <DeleteTodoForm 
                  onSubmit={delete_todo} 
                  todo_id={todo.id} 
                  close_modal={() => setShowDeleteModal(false)}/>
            </Modal>)}
      </>
   )
}

export default TodosListItem