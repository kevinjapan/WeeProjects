import React, { useState,useEffect,useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import TodoCard from './TodoCard'



const TodoContainer = () => {

   const [todo,setTodo] = useState({})
   const {api,setStatusMsg} = useContext(AppContext)
   let params = useParams()

   useEffect(() => {
      const get_todo = async (api) => {
         try {
               const data = await fetch(`${api}/${params.project_slug}/${params.task_slug}/${params.todo_slug}`,reqInit())
               const jsonData = await data.json()
               if(jsonData.outcome === 'success') {
                  setTodo(jsonData.data)
               } else {
                  await new Promise(resolve => setTimeout(resolve, 1000))
               }
         } catch {
               setStatusMsg('Sorry, unable to fetch data from the server.')
         }
      }
      get_todo(api,params)
   },[api,params.todo_id,setStatusMsg])

   return (
      <div>
         {todo.title ?
            <TodoCard todo={todo} />
         :  null}
      </div>
   )
}

export default TodoContainer