import React, { useState,useEffect,useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import Task from './Task'



const TaskContainer = () => {

   const [task,setTask] = useState({})
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   let params = useParams()

   useEffect(() => {
      const get_task = async (api) => {
         try {
            const data = await fetch(`${api}/${params.project_slug}/${params.task_slug}`,reqInit("GET",bearer_token))
            const jsonData = await data.json()
            if(jsonData.outcome === 'success') {
               setTask(jsonData.data)
            } 
            else {
               setStatusMsg(jsonData.message ? jsonData.message : "Sorry, we couldn't retrieve the Task.")
            }
         } catch {
            setStatusMsg('Sorry, unable to fetch data from the server.')
         }
      }
      get_task(api,params)
   },[api,params.todo_id,setStatusMsg])

   return (
      <div className="m-5">
         <Task task={task} />
      </div>
   )
}

export default TaskContainer