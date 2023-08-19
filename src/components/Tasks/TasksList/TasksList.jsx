import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import TaskCard from './TaskCard'
import TodoCard from '../../Todos/Todo/TodoCard'



const TasksList = props => {

   const [tasks,setTasks] = useState([])
   const [selected_task,setSelectedTask] = useState({})
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   // selected todo
   const [selected_todo,setSelectedTodo] = useState({})

   const [task_updated,setTaskUpdated] = useState(0)

   useEffect(() => {
      if(props.project.tasks) {
         setTasks([...props.project.tasks])
      }
   },[props.project,props.refreshed])

   const remove_deleted_task = deleted_task_id => {
      let modified_tasks = tasks.filter((task) => task.id !== deleted_task_id)
      setTasks(modified_tasks)
   }


   //
   //    get_tasks
   //
   const get_tasks = async() => {
      try {
         const data = await fetch(`${api}/${props.project_slug}/tasks`,reqInit("GET",bearer_token))
         const jsonData = await data.json()
         // await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === 'success') {
            
            setTasks(jsonData.data)

            if(selected_task) {
               const selected_task_id = selected_task.id
               const updated_selected_task = jsonData.data.filter(task => parseInt(task.id) === parseInt(selected_task_id))
               setSelectedTask(updated_selected_task[0])
               setTaskUpdated(task_updated + 1)
            }
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

   //
   //    update_todo
   //
   const update_todo = (task_id,todo_id,updated_todo) => {
      
      // get parent task
      const task_index = tasks.findIndex(task => parseInt(task.id) === parseInt(task_id))
      const task = tasks[task_index]

      // get index of updated Todo in existing tasks dataset
      const todo_index = task.todos.findIndex(element => parseInt(element.id) === parseInt(todo_id))

      let modified_tasks = tasks

      // we are modifying deep so useEffect in TaskCard doesn't detect the change - so we flush it to ensure it does.
      setSelectedTask({})

      // option 1 - just reload entire updated Tasks for project
      get_tasks()

      // to do : 
      // currently we retrieve all tasks - ok while no. is low - 
      // investigate alternative of injecting 'updated_todo' into existing tasks (and refresh that if required.)
      // so we maintain local copy of updated dataset.

      // to do : update TodoCard
      // selected_todo
      setSelectedTodo(updated_todo)
   }

   const is_unique = (item_id,item_field,value) => {
      //if(tasks) return true
      //const tasks = tasks.filter(task => parseInt(task.id) !== parseInt(item_id))
      //return tasks ? !tasks.some(task => task[item_field] === value) : true
      return true // to do : re-enable
   }

   const select_task = task => {
      setSelectedTodo({})
      setSelectedTask(task)
   }

   const view_todo_details = todo => {
      setSelectedTodo(todo)
   }
   const is_selected_task = id => {
      return parseInt(id) === parseInt(selected_task.id)
         ? ' border border-blue-900'
         : ' border border-transparent'
   }

   return (
      <div className="flex">
   
         {/* TasksList */}
         <section style={{width:'10%'}}>
            <ul className="flex flex-col gap-1 p-0 m-1">
               <label className="text-gray-400">Tasks</label>
               {tasks ? 
                  tasks.map(task => (
                     <li key={task.id} className={"px-1 " + is_selected_task(task.id)}>
                        <a className="cursor-pointer" onClick={() => select_task(task)}>{task.title}</a>
                     </li>
                  ))
               :null}
            </ul>
         </section>

         {/* to do : make layout here responsive / media query */}

         {/* TaskCard */}
         <section style={{width:'50%'}}>
            <TaskCard
               project_slug={props.project_slug} 
               task_updated={task_updated}
               task={selected_task} 
               is_unique={is_unique}
               update_list={update_list}
               remove_deleted_task={remove_deleted_task}
               view_todo_details={view_todo_details}
            /> 
         </section>

         {/* TodoCard */}
         {/* to do : we removed 'fixed' to get layout widths 
                     but have lost auto-positioning of card next to item list
                     perhaps we can get scroll and add margin-top to align? */}
         <section style={{width:'40%'}}>
         {selected_todo 
            ?  <TodoCard 
                  todo={selected_todo} 
                  is_unique={is_unique} 
                  update_todo={update_todo} />           
            :  null
         }</section>

      </div>
   )
}

                  
export default TasksList