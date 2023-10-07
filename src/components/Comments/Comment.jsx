import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../App/AppContext/AppContext'
import reqInit from '../Utility/RequestInit/RequestInit'
import get_ui_ready_date from '../Utility/DateTime/DateTime'
import { Notifications } from '../Utility/utilities/enums'
import NavBar from '../App/NavBar/NavBar'
import Modal from '../Utility/Modal/Modal'
import StyledButton from '../Utility/StyledButton/StyledButton'
import EditCommentForm from './EditCommentForm/EditCommentForm'
import DeleteCommentForm from './DeleteCommentForm/DeleteCommentForm'
import { PencilIcon,TrashIcon } from '@heroicons/react/24/solid'



const Comment = props => {

   const [comment,setComment] = useState({})
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   useEffect(() => {
      setComment(props.comment)
   },[])

   const update_comment = async(formJson) => {
      // eslint-disable-next-line
      let clear_message // prev. comment prevents warning ("clear_message not used.."")
      try {
         setStatusMsg(Notifications.UPDATING)
         const data = await fetch(`${api}/comments`,reqInit("PUT",bearer_token,formJson))
         const jsonData = await data.json()
         if(jsonData.outcome === Notifications.SUCCESS) {
            setComment(formJson)
         }
         setStatusMsg(Notifications.DONE)
         
         setStatusMsg('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_CONNECTION)
         setStatusMsg('Sorry, we are unable to update data on the server at this time.' + error)
      }
      setShowEditModal(false)
   }

   const delete_comment = async (formJson) => {
      try {
         formJson.id = formJson.comment_id
         setStatusMsg(Notifications.UPDATING)
         const data = await fetch(`${api}/comments`,reqInit("DELETE",bearer_token,formJson))
         const jsonData = await data.json()
         
         if(jsonData.outcome === Notifications.SUCCESS) {
            props.remove_deleted_comment(comment.id)
         }
         setStatusMsg(Notifications.DONE)
         
         setStatusMsg('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_SERVER_UPDATE + error)
      }
      setShowEditModal(false)
   }

   return (

      <section className="border rounded p-2 text-slate-700">

         <NavBar title={comment.title} truncate_title="false" title_tag="h6">
            <ul className="flex flex-row w-full">
               <li>
                  <StyledButton aria-label="Edit comment." onClicked={() => setShowEditModal(true)}>
                     <PencilIcon style={{width:'16px',height:'16px'}}/>Edit
                  </StyledButton>
               </li>
               <li>
                  <StyledButton aria-label="Delete comment." onClicked={() => setShowDeleteModal(true)}>
                     <TrashIcon style={{width:'16px',height:'16px'}}/>Delete
                  </StyledButton>
               </li>
               {/* 
               <li>
                  <div onClick={() => close_todo()} className="float-right mr-2 p-2 cursor-pointer text-lg" >X</div>
               </li> 
               */}
            </ul>
         </NavBar>

         <p className="italic text-sm  font-extralight text-slate-400 pl-4">Posted by {comment.author_id} on {get_ui_ready_date(comment.created_at)}</p>

         <p className="leading-relaxed pt-4 pl-4" style={{whiteSpace:'pre-line'}}>{comment.body}</p>



         {show_edit_modal && (
            <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
               <EditCommentForm 
                  onSubmit={update_comment} 
                  comment={comment} 
                  is_unique={props.is_unique}
                  close_modal={() => setShowEditModal(false)}/>
            </Modal>
         )}

         {show_delete_modal && (
            <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
               <DeleteCommentForm 
                  onSubmit={delete_comment} 
                  comment_id={comment.id} 
                  close_modal={() => setShowDeleteModal(false)}/>
            </Modal>
         )}

      </section>
   )
}

export default Comment