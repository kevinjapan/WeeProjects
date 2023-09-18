import React, { useState,useEffect,useContext } from 'react'
import { Routes,Route,Link,useParams } from 'react-router-dom'
import { AppContext } from '../../../App/AppContext/AppContext'
import reqInit from '../../../Utility/RequestInit/RequestInit'
import get_ui_ready_date from '../../../Utility/DateTime/DateTime'


const TodosManager = () => {
   
   let params = useParams()
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   const [todos,setTodos] = useState([])

   
   useEffect(() => {
      const get_todos = async (api) => {
         try {
            const data = await fetch(`${api}/${params.project_slug}/${params.task_slug}/todos_inclusive`,reqInit())
            const jsonData = await data.json()
            if(jsonData.outcome === 'success') {
               setTodos(jsonData.data)
            } else {
               await new Promise(resolve => setTimeout(resolve, 1000))
               setLoadingStatus(jsonData.message)
               }
         } catch {
            setStatusMsg('Sorry, unable to fetch data from the server.')
         }
      }
      get_todos(api,params)
   },[api,params.task_slug])

   return (
      <section className="w-11/12 m-2 mx-10 p-5 border rounded">

         <h5>
            <Link to={`/dashboard/artefacts/projects/${params.project_slug}/tasks`} className="text-blue-600">
            {params.project_slug}</Link>
            <span className="text-slate-400 mx-5 px-2 pb-1 border border-slate-300 rounded-2xl">{params.task_slug}</span> 
            <span className="font-bold">Todos</span>
         </h5>

         {/* <Link to={`todos`}>todos</Link>   to do : provide links into todosManager for current project */}

         <section className="m-5">
            <table className="w-full my-5">
               <tbody>
                  {todos.map((todo) => (
                     <tr key={todo.id}>

                        <td className="pt-1"><Link to={`${todo.slug}`}>{todo.title}</Link></td>
                        <td className="pt-1">{get_ui_ready_date(todo.created_at)}</td>
                        <td className="pt-1">{get_ui_ready_date(todo.updated_at)}</td>

                        {/* to do : todo.deleted_at status */}
                        <td className="pt-1">{todo.deleted_at}</td>

                     </tr>
                  ))}
               </tbody>
            </table>
         </section>

      </section>
   )
}

export default TodosManager