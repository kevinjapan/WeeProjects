import React, { useState,useEffect } from 'react'
import { BookmarkIcon } from '@heroicons/react/24/outline'



const TodosListItem = props => {

   const [todo] = useState(props.todo)
   const [checked,setChecked] = useState(false)

   useEffect(() => { 
      props.todo.done_at === null ? setChecked(false) : setChecked(props.todo.done_at)
   },[props.todo.done_at])

   const view_todo_details = () => {
      props.view_todo_details(todo)
   }

   let item_classes = 'w-full border rounded px-1 py-0.5 '
   let title_classes = 'p-0.5 cursor-pointer hover:bg-yellow-200 leading-tight'
   if(parseInt(props.selected_todo_id) === todo.id) item_classes += ' border-blue-900'
   
   return (
      <>
         <li key={props.todo.id} className={`${item_classes} ${todo.on_going && !checked > 0 ? 'bg-yellow-200' : ''}`} >
            <div className="flex justify-between gap-1 items-center w-full m-0">

               {todo.pin 
                  ?  <BookmarkIcon style={{width:'16px',height:'16px',opacity:'.7'}}/> 
                  :  <BookmarkIcon style={{width:'16px',height:'16px',opacity:'.3'}}/> 
               }
            
               <div className="w-full">
                  <div className={`${title_classes} ${checked ? 'line-through text-zinc-400 hover:text-zinc-600' : ''} `} 
                     onClick={() => view_todo_details()}>{todo.title}</div>
               </div>

               {/* 
               // open in separate window..
                <div>
                  <Link to={`/projects/${props.project_slug}/${props.task_slug}/${todo.slug}`}>
                     <StyledButton aria-label="Open todo.">
                        <BookOpenIcon style={{width:'12px',height:'12px'}}/>View
                     </StyledButton>
                  </Link>
               </div>
               */}

            </div>
               
         </li>
      </>
   )
}

export default TodosListItem