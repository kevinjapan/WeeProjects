import React, { useState,useEffect,useContext } from 'react'
import { Routes,Route,Link,useParams } from 'react-router-dom'
import { AppContext } from '../../../App/AppContext/AppContext'
import reqInit from '../../../Utility/RequestInit/RequestInit'
import { Notifications } from '../../../Utility/utilities/enums'
import get_ui_ready_date from '../../../Utility/DateTime/DateTime'
import Modal from '../../..//Utility/Modal/Modal'
import EditTodoManagerForm from './EditTodoManagerForm/EditTodoManagerForm'
import DeleteTodoManagerForm from './DeleteTodoManagerForm/DeleteTodoManagerForm'
import StyledButton from '../../../Utility/StyledButton/StyledButton'
import { TrashIcon } from '@heroicons/react/24/solid'


const TodosManager = () => {
   
   let params = useParams()
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   const [todos,setTodos] = useState([])
   const [selected_todo,setSelectedTodo] = useState({})
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const [local_status,setLocalStatus] = useState('')

   
   useEffect(() => {
      const get_todos = async (api) => {
         try {
            const data = await fetch(`${api}/${params.project_slug}/${params.task_slug}/todos_inclusive`,reqInit("GET",bearer_token))
            const jsonData = await data.json()
            if(jsonData.outcome === 'success') {
               setTodos(jsonData.data)
            } 
            else {
               setStatusMsg(jsonData.message ? jsonData.message : "Sorry, we couldn't retrieve Todos.")
            }
         } catch {
            setStatusMsg('Sorry, unable to fetch data from the server.')
         }
      }
      get_todos(api,params)
   },[api,params.task_slug])

   
   const confirm_delete_todo = () => {
      setShowEditModal(false)
      setShowDeleteModal(true)
   }

   const delete_todo = async (formJson) => {

      try {
         setLocalStatus(Notifications.UPDATING)

         const data = await fetch(`${api}/${params.project_slug}/${params.task_slug}/${selected_todo.slug}/delete_permanently`,reqInit("DELETE",bearer_token,selected_todo))
         
         const jsonData = await data.json()
         

         if(jsonData.outcome === Notifications.SUCCESS) {

            // we don't reset this - we don't mind that form contains prev Todo - it's not accessible
            // setSelectedTodo({})

            // refresh UI list
            let modified = todos.filter((todo) => todo.id !== selected_todo.id)
            setTodos(modified)
   
         }

         setLocalStatus(Notifications.DONE)
         
         setLocalStatus('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_SERVER_UPDATE + error)
      }
      setShowDeleteModal(false)
   }


   const edit_todo = todo => {
      setSelectedTodo(todo)
      setShowEditModal(true)
   }

   return (
      <section className="w-11/12 m-2 mx-10 p-5 border rounded">

         <h5>
            <Link to={`/dashboard/artefacts/projects/${params.project_slug}/tasks`} className="text-blue-600">
            {params.project_slug}</Link>
            <span className="text-slate-400 mx-5 px-2 pb-1 border border-slate-300 rounded-2xl">{params.task_slug}</span> 
            <span className="font-bold">Todos</span>
         </h5>

         <h6 className="text-slate-500">{todos.length} todo{todos.length !== 1 ? 's' : ''}</h6>

         <section className="m-5">
            <table className="w-full my-5">
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
                  {todos.map((todo) => (
                     <tr key={todo.id} className="border-b hover:bg-yellow-100 cursor-default">

                        <td className="pt-1">{todo.title}</td>
                        <td className="pt-1">{get_ui_ready_date(todo.created_at)}</td>
                        <td className="pt-1">{get_ui_ready_date(todo.updated_at)}</td>
                        <td className="pt-1">{get_ui_ready_date(todo.deleted_at)}</td>

                        <td>
                           <div onClick={() => edit_todo(todo)} className="text-blue-600 cursor-pointer">edit</div>
                           {/* <StyledButton aria-label="Edit this todo." onClicked={() => setShowEditModal(true)}>
                              <TrashIcon style={{width:'16px',height:'16px'}}/>Permanently Delete
                           </StyledButton> */}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </section>

         {show_edit_modal && (
            <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
               <EditTodoManagerForm 
                  todo={selected_todo} 
                  // is_unique={props.is_unique}
                  close_modal={() => setShowEditModal(false)}
                  // onSubmit={update_todo} 
                  onDelete={confirm_delete_todo}
               />
            </Modal>
            )}
         {show_delete_modal && (
            <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
               <DeleteTodoManagerForm 
                  todo_id={selected_todo.id} 
                  onSubmit={delete_todo} 
                  // close_modal={() => setShowDeleteModal(false)}
               />
            </Modal>
            )}
      </section>
   )
}

export default TodosManager