import React, { useState,useEffect,useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import Task from './Task'



const TaskContainer = () => {

   const [task,setTask] = useState({})
   const {api,setStatusMsg} = useContext(AppContext)
   let params = useParams()

   useEffect(() => {
      const get_task = async (api) => {
         try {
            const data = await fetch(`${api}/${params.project_slug}/${params.task_slug}`,reqInit())
            const jsonData = await data.json()
            if(jsonData.outcome === 'success') {
               setTask(jsonData.data)
            } else {
               await new Promise(resolve => setTimeout(resolve, 1000))
               setLoadingStatus(jsonData.message)
               }
         } catch {
            setStatusMsg('Sorry, unable to fetch data from the server.')
         }
      }
      get_task(api,params)
   },[api,params.todo_id,setStatusMsg])

   return (
      <div className="m-5">TaskContainer
         <Task task={task} />
      </div>
   )
}

export default TaskContainer