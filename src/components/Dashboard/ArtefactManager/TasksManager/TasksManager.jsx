import React, { useState,useEffect,useContext } from 'react'
import { Routes,Route,Link,useParams } from 'react-router-dom'
import { AppContext } from '../../../App/AppContext/AppContext'
import reqInit from '../../../Utility/RequestInit/RequestInit'
import { Notifications } from '../../../Utility/utilities/enums'
import get_ui_ready_date from '../../../Utility/DateTime/DateTime'
import Modal from '../../../Utility/Modal/Modal'
import EditTaskManagerForm from './EditTaskManagerForm/EditTaskManagerForm'
import DeleteTaskManagerForm from './DeleteTaskManagerForm/DeleteTaskManagerForm'
import StyledButton from '../../../Utility/StyledButton/StyledButton'
import { TrashIcon } from '@heroicons/react/24/solid'

const TasksManager = () => {
   
   let params = useParams()
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   
   const [tasks,setTasks] = useState([])
   const [selected_task,setSelectedTask] = useState({})
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const [local_status,setLocalStatus] = useState('')

   
   useEffect(() => {
      const get_tasks = async (api) => {
         try {
            const data = await fetch(`${api}/${params.project_slug}/tasks_inclusive`,reqInit())
            const jsonData = await data.json()
            if(jsonData.outcome === 'success') {
               setTasks(jsonData.data)
            } else {
               await new Promise(resolve => setTimeout(resolve, 1000))
               // setLoadingStatus(jsonData.message)  to do : ?
               }
         } catch {
            setStatusMsg('Sorry, unable to fetch data from the server.')
         }
      }
      get_tasks(api,params)
   },[api,params.project_slug])

   
   const confirm_delete_task = () => {
      setShowEditModal(false)
      setShowDeleteModal(true)
   }

   const delete_task = async (formJson) => {
      
      try {
         setLocalStatus(Notifications.UPDATING)
         
         // to do : verify this..
         const data = await fetch(`${api}/${params.project_slug}/${selected_task.slug}/delete_permanently`,reqInit("DELETE",bearer_token,selected_task))
         
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))

         if(jsonData.outcome === Notifications.SUCCESS) {

            // we don't reset this - we don't mind that form contains prev Todo - it's not accessible
            // setSelectedTask({})

            // refresh UI list
            let modified = tasks.filter((task) => task.id !== selected_task.id)
            setTasks(modified)
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

   const edit_task = task => {
      setSelectedTask(task)
      setShowEditModal(true)
   }


   return (
      <section className="w-11/12 m-2 mx-10 p-5 border rounded">
      
         <h5>
            {params.project_slug} &nbsp;
            <span className="font-bold">Tasks</span>
         </h5>

         <h6 className="text-slate-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</h6>

         {/* <Link to={`tasks`}>tasks</Link>   to do : provide links into TasksManager for current project */}

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
                  {tasks.map((task) => (
                     <tr key={task.id} className="border-b hover:bg-yellow-100 cursor-default">

                        <td className=""><Link to={`${task.slug}\\todos`} className="text-blue-600">{task.title}</Link></td>
                        <td className="">{get_ui_ready_date(task.created_at)}</td>
                        <td className="">{get_ui_ready_date(task.updated_at)}</td>
                        <td className="">{get_ui_ready_date(task.deleted_at)}</td>

                        <td>
                           <div onClick={() => edit_task(task)} className="text-blue-600 cursor-pointer">edit</div>
                           {/* <StyledButton aria-label="Edit this task." onClicked={() => setShowEditModal(true)}>
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
                  <EditTaskManagerForm 
                     task={selected_task}
                     // is_unique={props.is_unique}
                     close_modal={() => setShowEditModal(false)}
                     // onSubmit={update_todo} 
                     onDelete={confirm_delete_task}
                  />
               </Modal>
         )}

         {show_delete_modal && (
               <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
                  <DeleteTaskManagerForm 
                     task_id={selected_task.id} 
                     onSubmit={delete_task} 
                     // close_modal={() => setShowDeleteModal(false)}
                  />
               </Modal>
         )}

      </section>
   )
}

export default TasksManager