import React, { useState,useContext } from 'react'
import { AppContext } from '../App/AppContext/AppContext'
import reqInit from '../Utility/RequestInit/RequestInit'
import Modal from '../Utility/Modal/Modal'
import Comment from './Comment'
import StyledButton from '../Utility/StyledButton/StyledButton'
import { PlusIcon } from '@heroicons/react/24/solid'
import AddCommentForm from './AddCommentForm/AddCommentForm'



const CommentsList = props => {

   const [comments,setComments] = useState(props.comments)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   const [show_add_modal,setShowAddModal] = useState(false)

   const remove_deleted_comment = deleted_comment_id => {
      setComments(comments.filter((comment) => comment.id !== deleted_comment_id))
   }

   const add_comment = async(formJson) => {
      try {
         const data = await fetch(`${api}/comments`,reqInit("POST",bearer_token,formJson))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         
         if(jsonData.outcome === 'success') {

            formJson['id'] = jsonData.id
            let modified_comments = comments ? [...comments] : []

            if(!modified_comments.some(todo => todo.id === formJson.id)) {
                  modified_comments.push(formJson)
            }
            setComments(modified_comments)
         }
         else {
            console.log("Server couldn't create a new Comment")
         }
      }
      catch (err){
         setStatusMsg('Sorry, we are unable to update data on the server at this time. ' + err)
      }
      setShowAddModal(false)
   }

   const is_unique = (item_id,item_field,value) => {
      if(!comments) return true
      const filtered_comments = comments.filter(comment => parseInt(comment.id) !== parseInt(item_id))
      return filtered_comments ? !filtered_comments.some(comment => comment[item_field] === value) : true
   }

   return (
      <section className=" my-7 max-w-3xl mx-auto">
         <h3 className="text-xl text-slate-400">Comments</h3>
         <ul className="flex flex-col gap-5 list-none p-2">
            {comments ?
               comments.map((comment) => (
                  <li key={comment.id}>
                     <Comment comment={comment} is_unique={is_unique} remove_deleted_comment={remove_deleted_comment} />
                  </li>
               ))
               :  null
            }
         </ul>

         {comments ? comments.length : null}
         
         <div className="flex justify-end">
            <StyledButton aria-label="Add a comment." onClicked={() => setShowAddModal(true)} classes="flex gap-1">
               <PlusIcon style={{width:'16px',height:'16px'}}/>Add Comment
            </StyledButton>
         </div>

         {show_add_modal && (
            <Modal show={show_add_modal} close_modal={() => setShowAddModal(false)}>
               <AddCommentForm 
                  commentable_type={props.commentable_type}
                  commentable_id={props.commentable_id}
                  onSubmit={add_comment}
                  is_unique={is_unique}
                  close_modal={() => setShowAddModal(false)}/>
            </Modal>)}

      </section>
   )
}

export default CommentsList