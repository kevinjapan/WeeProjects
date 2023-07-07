import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
// import Task from '../Task/Task'
import TasksListItem from './TasksListItem'
import Todo from '../../Todos/Todo/Todo'

// import StyledButton from '../../Utility/StyledButton/StyledButton'
// import { ArrowLeftIcon,ArrowRightIcon } from '@heroicons/react/24/solid'



const TasksList = props => {

   // the tasks we show
   const [tasks,setTasks] = useState([])
   const [selected_task,setSelectedTask] = useState({})
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   // selected todo
   const [selected_todo,setSelectedTodo] = useState({})

   useEffect(() => {
      if(props.project.tasks) {
         setTasks([...props.project.tasks])
      }
   },[props.project,props.refreshed])




   const remove_deleted_task = deleted_task_id => {
      let modified_tasks = tasks.filter((task) => task.id !== deleted_task_id)
      setTasks(modified_tasks)
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
      //if(tasks) return true
      //const tasks = tasks.filter(task => parseInt(task.id) !== parseInt(item_id))
      //return tasks ? !tasks.some(task => task[item_field] === value) : true
      return true // to do : re-enable
   }

   const select_task = task => {
      setSelectedTask(task)
   }

   const view_todo_details = todo => {
      setSelectedTodo(todo)
   }

   return (
      <div className="flex "  >
         <section style={{width:'12%'}}>
            <ul className="flex flex-col gap-2 p-0 m-1">
               <label className="text-gray-400">Tasks</label>
               {tasks ? 
                  tasks.map(task => (
                     <li key={task.id}><a className="cursor-pointer" onClick={() => select_task(task)}>{task.title}</a></li>
                  ))
               :null}
            </ul>
         </section>

{/* to do : this is no longer a 'listitem' */}
         <section  style={{width:'55%'}}>
            {/* <Task task={selected_task} /> */}
            <TasksListItem
               project_slug={props.project_slug} 
               task={selected_task} 
               is_unique={is_unique}
               update_list={update_list}
               remove_deleted_task={remove_deleted_task}
               view_todo_details={view_todo_details}
            /> 

         </section>



               {
               selected_todo ?
                     <Todo 
                        todo={selected_todo}
                        is_unique={is_unique}
                     />                  
                  : null
               }

      </div>
   )
}

 {/* <TasksListItem
                     key={task.id} 
                     project_slug={props.project_slug} 
                     task={selected_task} 
                     is_unique={is_unique}
                     update_list={update_list}
                     remove_deleted_task={remove_deleted_task}
                  /> */}
                  
export default TasksList