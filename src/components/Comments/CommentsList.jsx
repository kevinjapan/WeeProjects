import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../App/AppContext/AppContext'
import reqInit from '../Utility/RequestInit/RequestInit'
import Modal from '../Utility/Modal/Modal'
import {get_db_ready_datetime} from '../Utility/DateTime/DateTime'
import Comment from './Comment'
import StyledButton from '../Utility/StyledButton/StyledButton'
import { PlusIcon } from '@heroicons/react/24/solid'
import AddCommentForm from './AddCommentForm/AddCommentForm'



const CommentsList = props => {

   
   const HeadingTag = props.title_tag || "h5"

   const [comments,setComments] = useState([])
   const [retrieval_attempted,setRetrievalAttempted] = useState(false)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   const [show_add_modal,setShowAddModal] = useState(false)

   useEffect(() => {
      get_comments()
      setRetrievalAttempted(false)
   },[props.commentable_id])


   const remove_deleted_comment = deleted_comment_id => {
      setComments(comments.filter((comment) => comment.id !== deleted_comment_id))
   }

   //
   // Comments are not retrieved with the complete Project JSON at initiation.
   // We retrieve comments when this component is opened (eg in a TodoCard).
   // Currently we do retrieve on each opening of the parent - future, improve?
   //
   const get_comments = async() => {
      setComments([])
      try {
         const data = await fetch(`${api}/${props.commentable_type}/comments/${props.commentable_type}/${props.commentable_id}`,reqInit("GET",bearer_token))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === 'success') {
            setComments(jsonData.data)
            setRetrievalAttempted(true)
         }
         else {
            setStatusMsg("Server couldn't retrieve Comments list.")
         }
      } catch (error){
         setStatusMsg('Sorry, we are unable to retrieve data from the server at this time. ' + error)
      }
   }

   const add_comment = async(formJson) => {

      let date = new Date()
      formJson['created_at'] = get_db_ready_datetime(date)

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
            console.log(modified_comments)
            setComments(modified_comments)
         }
         else {
            setStatusMsg("Server couldn't create a new Comment")
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
      <section className="mx-0 my-7 w-full">

         <HeadingTag className="font-extralight pt-0 mt-0 pl-5 bg-blue-400 text-white rounded">
            {props.commentable_type} comments
         </HeadingTag>
         
         {retrieval_attempted
            ?  comments 
                  ?  <h6 className="text-center text-slate-500 mt-4 text-lg">
                        There { comments.length > 1 ? 'are' : 'is' } {comments ? comments.length : '0'} comment{ comments.length > 1 ? 's' : '' }
                     </h6>
                  :  <h6 className="text-center text-slate-500 mt-4 text-lg">
                        There are 0 comments
                     </h6>
            :  <h6 className="text-center text-slate-500 mt-4 text-lg">Checking for Comments...</h6>
         }
         
         <ul className="flex flex-col gap-5 list-none mt-7 p-2">
            {comments ?
               comments.map((comment) => (
                  <li key={comment.id}>

                     <Comment 
                        comment={comment} 
                        is_unique={is_unique} 
                        remove_deleted_comment={remove_deleted_comment} 
                     />

                  </li>
               ))
               :  null
            }
         </ul>

         
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