import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CommentsList from '../Comments/CommentsList'
import MessageToggler from './MessageToggler/MessageToggler'
import truncate from '../Utility/Stringer/uiStringer'

const Message = props => {

   const [is_open,setIsOpen] = useState(false)

   return (
      <li className={"w-full px-1 border border-slate-500 rounded-xl shadow-lg px-5 pt-3 pb-7"} >

         <MessageToggler is_open={is_open} toggle={setIsOpen} />

         <div className="text-3xl font-semibold">{props.message.title}</div>
         <div>{props.message.author_id}</div>
         <div>{props.message.created_at}</div>
         {is_open
            ?  <><div>{props.message.body}</div>
               
               <CommentsList 
                  commentable_type="message"
                  commentable_id={props.message.id}
                  comments={props.message.comments} 
               />
               </>
            :  <>
                  <div>{truncate(props.message.body,250)}</div>
               </>
         }

         <MessageToggler is_open={is_open} toggle={setIsOpen} />
      
      </li>
   )
   
}

export default Message