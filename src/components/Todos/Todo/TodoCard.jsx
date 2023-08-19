import React, { useState,useEffect,useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../App/AppContext/AppContext'
import { datetimestamp } from '../../Utility/Dates/Dates'
import { Notifications } from '../../Utility/utilities/enums'
import reqInit from '../../Utility/RequestInit/RequestInit'
import Modal from '../../Utility/Modal/Modal'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import EditTodoForm from '../EditTodoForm/EditTodoForm'
import DeleteTodoForm from '../DeleteTodoForm/DeleteTodoForm'
import get_ui_ready_date from '../../Utility/Dates/Dates'
// import CommentsList from '../../Comments/CommentsList'



const TodoCard = props => {

   let params = useParams()
   
   const [todo,setTodo] = useState(props.todo)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   const [checked,setChecked] = useState(false)
   const [local_status,setLocalStatus] = useState('')
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)

   useEffect(() => { 
      console.log(props.todo)
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

         // to do : any way to make endpoints clearer here? (rather than trying to match a url route each time)
         const data = await fetch(`${api}/${props.project_slug}/${props.task_slug}/todos/${todo.slug}`,reqInit("PUT",bearer_token,formJson))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === Notifications.SUCCESS) {

            // console.log('on-going: ' + formJson.on_going)

            setTodo(formJson) 
            props.update_todo(todo.task_id,todo.id,formJson)
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

   const close_todo = () => {
      setTodo({})
   }


   const item_classes = 'w-full border rounded px-1 py-0.5 '
   const title_classes = 'p-0.5 cursor-pointer text-slate-600 hover:text-slate-800 leading-tight'

   return (
      todo.title ?
      <section className="border rounded p-1">
   
         <section className="w-full h-6">
            <div onClick={() => close_todo()} className="float-right mr-2 cursor-pointer" >X</div>
         </section>
         <h1 className="text-2xl text-slate-600">{props.todo.title}</h1>

         <section className="flex flex-col gap-2 border rounded m-2 p-2">

            {props.todo.outline
               ? <p className="text-gray-700">{props.todo.outline}</p>
               : <p className="italic text-gray-300">This todo has no description.</p>}
         </section>

         <section className="flex flex-col gap-2 border rounded m-2 p-2">

            <div>
               created: {get_ui_ready_date(props.todo.created_at)}
            </div>

            <div>
               last updated:{get_ui_ready_date(props.todo.updated_at)}
            </div>

            <div>author:{props.todo.author_id}</div>

            {/* <div>task id:{props.todo.task_id}</div> */}


         </section>


         <section>
         {/* to do : populate - see EditTodoForm */}
         mark as on-going
         pin 
         </section>

      {/* <CommentsList 
         commentable_type="todo"
         commentable_id={props.todo.id}
         comments={props.todo.comments} /> */}

         


         <StyledButton  aria-label="Edit.">
            <div className={`${title_classes} ${checked ? 'text-zinc-400 hover:text-zinc-600' : ''} `} 
               onClick={() => setShowEditModal(true)}>edit</div>
         </StyledButton>

         {show_edit_modal && (
            <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
               <EditTodoForm 
                  onSubmit={update_todo} 
                  onDelete={confirm_delete_todo} 
                  todo={todo} 
                  is_unique={props.is_unique}
                  close_modal={() => setShowEditModal(false)}/>
            </Modal>)}

      </section>
      : null
         
      // <div className="md:w-8/12 mx-auto">

      //    {/* Todo details */}
      //    <section className="mb-5">
      //       <h3 className="text-sm text-slate-500">
      //          <Link to={`/projects/${params.project_slug}`}>{params.project_slug}</Link> / 
      //          <Link to={`/projects/${params.project_slug}/${params.task_slug}`}>{params.task_slug}</Link>
      //       </h3>
      //       <h1 className="text-2xl text-slate-600">{props.todo.title}</h1>
      //    </section>

      //    <section className="flex flex-col gap-2 border rounded m-2 p-2">
      //       <div>created at: {get_ui_ready_date(props.todo.created_at)}</div>
      //       <div>updated at:{get_ui_ready_date(props.todo.updated_at)}</div>
      //       <div>author:{props.todo.author_id}</div>
      //       <div>task:{props.todo.task_id}</div>
      //       <div></div>
      //    </section>

      //    <CommentsList 
      //       commentable_type="todo"
      //       commentable_id={props.todo.id}
      //       comments={props.todo.comments} />
      // </div>
   )
}

export default TodoCard