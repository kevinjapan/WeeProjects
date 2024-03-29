import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../Utility/Validation/uiValidation'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import StyledTextArea from '../../Utility/StyledTextArea/StyledTextArea'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import { generate_slug } from '../../Utility/Stringer/uiStringer'
import { LENGTHS as LEN } from '../../Utility/utilities/enums'


const AddCommentForm = props => {

   const [title,setTitle] = useState('')
   const [author_id,setAuthorId] = useState('')
   const [body,setBody] = useState('')
   const [title_feedback,setTitleFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')
   const [body_feedback,setBodyFeedback] = useState('')

   const handleSubmit = e => {
      
      setTitleFeedback('')
      setAuthorIdFeedback('')
      setBodyFeedback('')

      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());

      let validated = true

      formJson['title'] = formJson['title'].trim()

      if(!props.is_unique(0,'title',formJson['title'])) {
         setTitleFeedback('This title already exists, please enter a different title.')
         validated = false
      }

      if(!validate_string(formJson['title'],{'min_length':LEN.TITLE_MIN,'max_length':LEN.TITLE_MAX},setTitleFeedback)) {
         validated = false
      } 
      else {
         formJson['slug'] = generate_slug(formJson['title'])
      }

      if(!validate_int(formJson['author_id'],{},setAuthorIdFeedback)) {
         validated = false
      }
      if(!validate_string(formJson['body'],{'min_length':LEN.COMMENT_MIN,'max_length':LEN.COMMENT_MAX},setBodyFeedback)) {
         validated = false
      }
      
      if(validated) props.onSubmit(formJson)
   }

   return (
      <form onSubmit={handleSubmit}>

         <h5 className="text-2xl mb-5">Add Comment</h5>
         
         <input type="hidden" name="commentable_type" value={props.commentable_type} />
         <input type="hidden" name="commentable_id" value={props.commentable_id} />

         <div className="flex">
               
            <section className="w-2/12">
         

               <FormElement>
                  <label htmlFor="author_id" className="italic pt-1 w-12/12 md:w-6/12">Author Id</label>
                  <StyledInput
                     id="author_id" 
                     name="author_id" 
                     value={author_id || 1}
                     placeholder="enter the author id here"
                     classes="w-6/12"
                     onChanged={setAuthorId}></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={author_id_feedback}/>

            </section>

            <section className="w-10/12 pl-12">

               <FormElement>
                  <label htmlFor="title" className="italic pt-1 w-12/12 md:w-1/12">Title</label>
                  <StyledInput 
                     id="title"
                     name="title" 
                     value={title}
                     placeholder="enter the title here"
                     classes="w-11/12"
                     onChanged={setTitle}></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={title_feedback}/>

               <FormElement>
                  <label htmlFor="body" className="italic pt-1 w-12/12 md:w-1/12">Body</label>
                  <StyledTextArea 
                     id="body"
                     name="body" 
                     value={body}
                     placeholder="enter your comment body here"
                     classes="w-11/12"
                     onChanged={setBody}></StyledTextArea>
               </FormElement>
               <FormElementFeedback feedback_msg={body_feedback}/>

            </section>

         </div>

         <div className="flex justify-end gap-1 my-1">
               <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
               <StyledButton aria-label="Cancel." type="button" onClicked={props.close_modal}>Cancel</StyledButton>
         </div>
      </form>
   )
}

export default AddCommentForm