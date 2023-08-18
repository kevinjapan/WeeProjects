import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import TaskCard from './TaskCard'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { ArrowLeftIcon,ArrowRightIcon } from '@heroicons/react/24/solid'



const TasksList = props => {

   const [tasks,setTasks] = useState([])

   // the tasks we show
   const [filtered_tasks,setFilteredTasks] = useState([])
   const tasks_window_size = 3
   const [tasks_start_index,setTasksStartIndex] = useState(0)

   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   useEffect(() => {
      if(props.project.tasks) {
         setTasks([...props.project.tasks])
         filter_tasks([...props.project.tasks],0)
      }
   },[props.project,props.refreshed])

   const filter_tasks = (tasks_list,start_index) => {
      if(tasks_list.length <= tasks_window_size) {
         setFilteredTasks(tasks_list)
      }
      else {
         setTasksStartIndex(start_index)
         setFilteredTasks([...tasks_list].filter((task,index) => {
            return ((index >= start_index) && (index < start_index + tasks_window_size))
         }))
      }
   }

   const advance_earlier_tasks = () => {
      let new_start_index = tasks_start_index + tasks_window_size
      filter_tasks(tasks,new_start_index > (tasks.length - tasks_window_size) ? tasks.length - tasks_window_size : new_start_index)
   }
   const advance_recent_tasks = () => {
      let new_start_index = tasks_start_index - tasks_window_size
      filter_tasks(tasks,new_start_index < 0 ? 0 : new_start_index)
   }

   const remove_deleted_task = deleted_task_id => {
      let modified_tasks = tasks.filter((task) => task.id !== deleted_task_id)
      setTasks(modified_tasks)
      // generate filtered from scratch to avoid synch issues
      filter_tasks(modified_tasks,tasks_start_index)
   }


   // listitems may invoke changes to parent list ('pin to start' etc)
   // we retrieve list dataset upon listitem's request (upon order changing actions)
   const get_tasks = async() => {
      try {
         const data = await fetch(`${api}/${props.project_slug}/tasks`,reqInit("GET",bearer_token))
         const jsonData = await data.json()
         // await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === 'success') {
            setTasks(jsonData.data)
            filter_tasks(jsonData.data,0)
         }
         else {
            setStatusMsg("Server couldn't retrieve updated Todos list.")
         }
      } catch (error){
         setStatusMsg('Sorry, we are unable to retrieve data from the server at this time. ' + error)
      }
   }

   // an updated Task can affect list order, so we refresh from server
   const update_list = () => {
      get_tasks()
   }

   const is_unique = (item_id,item_field,value) => {
      if(!tasks) return true
      const filtered_tasks = tasks.filter(task => parseInt(task.id) !== parseInt(item_id))
      return filtered_tasks ? !filtered_tasks.some(task => task[item_field] === value) : true
   }

   return (
      <>


         {/*  */}
         <ul className="flex flex-col sm:flex-row flex-wrap justify-between gap-2 p-0 m-0">
            {filtered_tasks ? 
               filtered_tasks.map(task => (
                  <TaskCard
                     key={task.id} 
                     project_slug={props.project_slug} 
                     task={task} 
                     is_unique={is_unique}
                     update_list={update_list}
                     remove_deleted_task={remove_deleted_task}
                  />
               ))
            :null}
         </ul>
      </>
   )
}

export default TasksList