import React, { useState,useEffect } from 'react'
import TasksListItem from './TasksListItem'
import StyledButton from '../../Utility/StyledButton/StyledButton'



const TasksList = props => {

   const [tasks,setTasks] = useState([])

   // the tasks we show
   const [filtered_tasks,setFilteredTasks] = useState([])
   const tasks_window_size = 3
   const [tasks_start_index,setTasksStartIndex] = useState(0)

   useEffect(() => {
      if(props.project.tasks) {
         setTasks([...props.project.tasks])
         filter_tasks([...props.project.tasks],0)
      }
   },[props.project])

   const filter_tasks = (tasks_list,start_index) => {
      // console.log(tasks_list)
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

   // on changing tasks viewed, we refresh children w/ each 'task'
   // so - must update todo lists here as well as in the child:
   const update_task_todos = (task_id,updated_todos) => {
      let modified_tasks = [...tasks]
      let task = modified_tasks.find(task => {
         return task.id === task_id
      })
      if(task) {task.todos = [...updated_todos]}
      filter_tasks(modified_tasks,tasks_start_index)
   }

   const update_task = (task_id,updated_task) => {
      let modified_tasks = [...tasks]
      let task_index = modified_tasks.findIndex(task => {
         return task.id === task_id
      })
      if(task_index > -1) {
         modified_tasks[task_index] = updated_task
         setTasks([...modified_tasks])
         filter_tasks(modified_tasks,tasks_start_index)
      }
   }

   const is_unique = (item_id,item_field,value) => {
      if(!tasks) return true
      const filtered_tasks = tasks.filter(task => parseInt(task.id) !== parseInt(item_id))
      return filtered_tasks ? !filtered_tasks.some(task => task[item_field] === value) : true
   }

   return (
      <>
         <div className="flex justify-between mt-4 mb-2 ">
            <StyledButton 
               aria-label="Display newer tasks." 
               onClicked={advance_recent_tasks}>Recent Tasks
            </StyledButton>

            <div className="text-sm text-slate-400">{tasks.length} tasks</div>
            <div className="text-sm text-slate-400">{filtered_tasks.length} filtered_tasks</div>
            
            <StyledButton 
               aria-label="Display older tasks." 
               onClicked={advance_earlier_tasks}>Earlier Tasks
            </StyledButton>
         </div>
         <ul className="flex flex-col sm:flex-row flex-wrap justify-between gap-2 p-0 m-0">
            {filtered_tasks ? 
               filtered_tasks.map(task => (
                  <TasksListItem
                     key={task.id} 
                     project_slug={props.project_slug} 
                     task={task} 
                     is_unique={is_unique}
                     remove_deleted_task={remove_deleted_task}
                     update_task={update_task}
                     update_task_todos={update_task_todos}
                  />
               ))
            :null}
         </ul>
      </>
   )
}

export default TasksList