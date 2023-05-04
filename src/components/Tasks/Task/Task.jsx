import React from 'react'
import { Link,useParams } from 'react-router-dom'
import get_ui_ready_date from '../../Utility/Dates/Dates'


const Task = props => {

   let params = useParams()

   return (
      <div className="md:w-8/12 mx-auto">

         {/* Task details */}
         <section className="mb-5">
            <h3 className="text-sm text-slate-500">
               <Link to={`/projects/${params.project_slug}`}>{params.project_slug}</Link>
            </h3>
            <h1 className="text-2xl text-slate-600">{props.task.title}</h1>
         </section>

         <section className="flex flex-col gap-2 border rounded m-2 p-2">
            <div>created at: {get_ui_ready_date(props.task.created_at)}</div>
            <div>updated at:{get_ui_ready_date(props.task.updated_at)}</div>
            <div>author:{props.task.author_id}</div>
            <div></div>
         </section>

      </div>
   )
}

export default Task