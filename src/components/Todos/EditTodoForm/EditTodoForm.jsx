import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../Utility/Validation/uiValidation'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import { generate_slug } from '../../Utility/Stringer/uiStringer'



const EditTodoForm = props => {

   const [id] = useState(props.todo.id)
   const [title,setTitle] = useState(props.todo.title)
   const [author_id,setAuthorId] = useState(props.todo.author_id)
   const [title_feedback,setTitleFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')

   const [is_on_going,setIsOnGoing] = useState(props.todo.on_going > 0 ? true : false)

   const handleSubmit = e => {
      
      setTitleFeedback('')
      setAuthorIdFeedback('')
      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());
      formJson.on_going = is_on_going

      let validated = true
      
      formJson['title'] = formJson['title'].trim()

      if(!props.is_unique(formJson['id'],'title',formJson['title'])) {
         setTitleFeedback('This title already exists, please enter a different title.')
         validated = false
      }

      if(!validate_string(formJson['title'],{'min_length':10,'max_length':250},setTitleFeedback)) {
         validated = false
      } else {
         formJson['slug'] = generate_slug(formJson['title'])
      }

      if(!validate_int(formJson['author_id'],{},setAuthorIdFeedback)) {
         validated = false
      }
      
      if(validated) props.onSubmit(formJson)
   }
   
   const toggle_ongoing = () => {
      setIsOnGoing(!is_on_going)
   }

   return (
      <form onSubmit={handleSubmit} className="p-3 px-4">

         <h5 className="text-2xl mb-5">Edit Todo</h5>

         <input type="hidden" name="id" value={id || 0} />

         <FormElement>
            <label htmlFor="title" className="w-12/12 md:w-2/12">Title</label>
            <StyledInput 
               name="title" 
               value={title || ''} 
               onChanged={setTitle}></StyledInput>
         </FormElement>

         <FormElementFeedback feedback_msg={title_feedback}/>

         <FormElement>
            <label htmlFor="author_id" className="w-12/12 md:w-2/12">Author Id</label>
            <StyledInput 
               name="author_id" 
               value={author_id || ''} 
               onChanged={setAuthorId}></StyledInput>
         </FormElement>

         <FormElementFeedback feedback_msg={author_id_feedback}/>

         <div className="flex justify-end gap-1">

            <div className="flex gap-2 items-center text-slate-400 text-sm mr-7">
               <input 
                  name="on_going"
                  type="checkbox" 
                  checked={is_on_going || false}
                  onChange={e => {toggle_ongoing(e.target.checked)}} 
               />mark as on-going
            </div>

            <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
            <StyledButton aria-label="Delete." onClicked={props.onDelete}>Delete</StyledButton>
            <StyledButton aria-label="Cancel." onClicked={props.close_modal}>Cancel</StyledButton>
         </div>
      </form>
   )
}

export default EditTodoForm