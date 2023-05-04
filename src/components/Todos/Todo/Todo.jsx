import React from 'react'
import { Link,useParams } from 'react-router-dom'
import get_ui_ready_date from '../../Utility/Dates/Dates'
import CommentsList from '../../Comments/CommentsList'



const Todo = props => {

   let params = useParams()

   return (
      <div className="md:w-8/12 mx-auto">

         {/* Todo details */}
         <section className="mb-5">
            <h3 className="text-sm text-slate-500">
               <Link to={`/projects/${params.project_slug}`}>{params.project_slug}</Link> / 
               <Link to={`/projects/${params.project_slug}/${params.task_slug}`}>{params.task_slug}</Link>
            </h3>
            <h1 className="text-2xl text-slate-600">{props.todo.title}</h1>
         </section>

         <section className="flex flex-col gap-2 border rounded m-2 p-2">
            <div>created at: {get_ui_ready_date(props.todo.created_at)}</div>
            <div>updated at:{get_ui_ready_date(props.todo.updated_at)}</div>
            <div>author:{props.todo.author_id}</div>
            <div>task:{props.todo.task_id}</div>
            <div></div>
         </section>

         <CommentsList 
            commentable_type="todo"
            commentable_id={props.todo.id}
            comments={props.todo.comments} />
      </div>
   )
}

export default Todo