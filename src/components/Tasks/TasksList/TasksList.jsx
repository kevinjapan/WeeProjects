import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import TaskCard from './TaskCard'
import TodoCard from '../../Todos/Todo/TodoCard'
import SessionsManager from '../../Sessions/SessionsManager/SessionsManager'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { PlusIcon } from '@heroicons/react/24/solid'




const TasksList = props => {

   const [tasks,setTasks] = useState([])
   const [selected_task,setSelectedTask] = useState({})
   const [selected_todo,setSelectedTodo] = useState({})
   const [task_updated,setTaskUpdated] = useState(0)
   const [show_welcome,setShowWelcome] = useState(props.show_welcome)
   const [manage_task_sessions,setManageTaskSessions] = useState(false)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   useEffect(() => {
      if(props.project.tasks) {
         setTasks([...props.project.tasks])
      }
   },[props.project,props.refreshed])

   useEffect(() => {
      setShowWelcome(props.show_welcome)
   },[props.show_welcome])


   const get_tasks = async() => {

      try {
         const data = await fetch(`${api}/${props.project_slug}/tasks`,reqInit("GET",bearer_token))
         const jsonData = await data.json()
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

   const remove_deleted_task = deleted_task_id => {
      let modified_tasks = tasks.filter((task) => task.id !== deleted_task_id)
      setTasks(modified_tasks)
   }


   // TodoCard requests update, then calls TasksList here to refresh list..
   const update_todo = (updated_todo) => {
      
      // we are modifying deep so useEffect in TaskCard doesn't detect the change - so we flush it to ensure it does.
      setSelectedTask({})

      // currently we just reload entire updated Tasks for project
      // future : review -  retrieving all tasks - ok while number is low
      get_tasks()

      setSelectedTodo(updated_todo)
   }

   const remove_deleted_todo = () => {

      // flush Task to ensure UI reflects changes..
      setSelectedTask({})
      
      // reload updated Tasks for project
      get_tasks()
   }

   // SessionsManager requests update, then calls TasksList here to refresh list..
   const update_session = () => {
      // currently we just reload entire updated Tasks for project
      get_tasks()
   }

   const remove_deleted_session = () => {
      // reload updated Tasks for project
      get_tasks()
   }

   // future : refactor is_unique - worked for 'titles' - for sessions etc?
   const is_unique = (item_id,item_field,value) => {
      //if(tasks) return true
      //const tasks = tasks.filter(task => parseInt(task.id) !== parseInt(item_id))
      //return tasks ? !tasks.some(task => task[item_field] === value) : true
      return true
   }

   const is_unique_session = () => {

   }

   const select_task = task_id => {
      setSelectedTodo({})
      // we find with 'task_id' since we may have refreshed dataset from server..
      setSelectedTask(tasks.find((task) => parseInt(task.id) === parseInt(task_id)))
      setShowWelcome(false)
      props.setShowWelcome(false)
   }

   const view_todo_details = todo => {
      setSelectedTodo(todo)
      setManageTaskSessions(false)
   }
   const is_selected_task = id => {
      if(selected_task.id) {
         return parseInt(id) === parseInt(selected_task.id)
            ? ' rounded bg-yellow-200'
            : ' '
         }
      return ''
   }

   const manage_sessions = () => {
      setSelectedTodo({})
      setManageTaskSessions(true)
   }

   return (
      <div className="flex gap-2 mt-4">

         {/* TasksList */}

         <section style={{width:'15%',marginLeft:'.5rem'}}>
            <ul className="flex flex-col gap-3 p-1 border border-gray-400 rounded-lg shadow-lg">
               <div className="text-gray-400">Tasks</div>
               {tasks ? 
                  tasks.map(task => (
                     <li key={task.id} className={"w-full px-1 " + is_selected_task(task.id)} >
                        <a className="w-full block cursor-pointer" onClick={() => select_task(task.id)}>{task.title}</a>
                     </li>
                  ))
               :null}
               <StyledButton aria-label="Add a new task." onClicked={() => props.setShowAddTaskModal(true)}>
                  <PlusIcon style={{width:'16px',height:'16px'}}/>Add A Task
               </StyledButton>
            </ul>
            

         </section>


         {/* TaskCard */}

         <section style={{width:'42%',marginRight:'.35rem'}}>
            {selected_task.id && !show_welcome
               ?  <TaskCard
                     project_slug={props.project_slug} 
                     task_updated={task_updated}
                     task={selected_task} 
                     sessions={selected_task.sessions}
                     is_unique={is_unique}
                     update_list={update_list}
                     remove_deleted_task={remove_deleted_task}
                     view_todo_details={view_todo_details}
                     manage_sessions={manage_sessions}
                     update_session={update_session}
                  /> 
               :  <div>
            
                     <h3>welcome to the project page</h3>

                     <p className="p-5">project overview here</p>

                     {/* future : separate component (& links?) */}
                     <h5>Team</h5>
                     <ul className="m-5 p-2 border rounded">
                        {props.project.users
                           ?  props.project.users.map((user) => (
                                 <li key={user.id}>{user.user_name}</li>
                              ))
                           :  null
                        }
                     </ul>

                  </div>
            }
         </section>


         <section style={{width:'44%',marginRight:'.5rem'}}>
         
            {/* TodoCard */}

            {selected_todo && !show_welcome
               ?  <TodoCard 
                     todo={selected_todo} 
                     is_unique={is_unique} 
                     update_todo={update_todo} 
                     remove_deleted_todo={remove_deleted_todo}
                     />
               :  null
            }


            {/* SessionsManager */}

            {manage_task_sessions
               ?  <SessionsManager 
                     sessions={selected_task.sessions}
                     is_unique_session={is_unique_session}   
                     update_session={update_session} 
                     remove_deleted_session={remove_deleted_session}
                     />
               :  null
            }

         </section>


      </div>
   )
}

                  
export default TasksList