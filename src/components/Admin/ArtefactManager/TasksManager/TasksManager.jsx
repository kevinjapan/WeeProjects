import React, { useState,useEffect,useContext } from 'react'
import { Routes,Route,Link,useParams } from 'react-router-dom'
import { AppContext } from '../../../App/AppContext/AppContext'
import reqInit from '../../../Utility/RequestInit/RequestInit'
import get_ui_ready_date from '../../../Utility/DateTime/DateTime'

const TasksManager = () => {
   
   let params = useParams()
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   
   const [tasks,setTasks] = useState([])

   
   useEffect(() => {
      const get_tasks = async (api) => {
         try {
            const data = await fetch(`${api}/${params.project_slug}/tasks_inclusive`,reqInit())
            const jsonData = await data.json()
            if(jsonData.outcome === 'success') {
               setTasks(jsonData.data)
            } else {
               await new Promise(resolve => setTimeout(resolve, 1000))
               setLoadingStatus(jsonData.message)
               }
         } catch {
            setStatusMsg('Sorry, unable to fetch data from the server.')
         }
      }
      get_tasks(api,params)
   },[api,params.project_slug])

   return (
      <section className="w-11/12 m-2 mx-10 p-5 border rounded">
      
         <h5>{params.project_slug} <span className="font-bold">Tasks</span></h5>

         {/* <Link to={`tasks`}>tasks</Link>   to do : provide links into TasksManager for current project */}

         <section className="m-5">
            <table className="w-full my-5">
               <tbody>
                  {tasks.map((task) => (
                     <tr key={task.id}>

                        <td className="pt-1"><Link to={`${task.slug}\\todos`} className="text-blue-600">{task.title}</Link></td>
                        <td className="pt-1">{get_ui_ready_date(task.created_at)}</td>
                        <td className="pt-1">{get_ui_ready_date(task.updated_at)}</td>
                        <td className="pt-1">{task.deleted_at}</td>

                     </tr>
                  ))}
               </tbody>
            </table>
         </section>
         
      </section>
   )
}

export default TasksManager