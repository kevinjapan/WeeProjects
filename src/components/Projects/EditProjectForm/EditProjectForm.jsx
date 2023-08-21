import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_string,validate_int } from '../../Utility/Validation/uiValidation'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import { generate_slug } from '../../Utility/Stringer/uiStringer'



const UpdateProjectForm = props => {

   const [id] = useState(props.project.id)
   const [title,setTitle] = useState(props.project.title)
   const [author_id,setAuthorId] = useState(props.project.author_id)
   const [title_feedback,setTitleFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')

   const handleSubmit = e => {
      
      setTitleFeedback('')
      setAuthorIdFeedback('')
      e.preventDefault()
      
      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());

      let validated = true

      formJson['title'] = formJson['title'].trim()

      if(!props.is_unique(formJson['id'],'title',formJson['title'])) {
         setTitleFeedback('This title already exists, please enter a different title.')
         validated = false
      }

      if(!validate_string(formJson['title'],{'min_length':3,'max_length':50},setTitleFeedback)) {
         validated = false
      } else {
         formJson['slug'] = generate_slug(formJson['title'])
      }

      if(!validate_int(formJson['author_id'],{},setAuthorIdFeedback)) {
         validated = false
      }
      
      if(validated) props.onSubmit(formJson)
   }

   return (
      <form onSubmit={handleSubmit}>

         <h5 className="text-2xl mb-5">Edit Project</h5>

         <FormElement>
            <label htmlFor="id" className="w-12/12 md:w-2/12">Id</label>
            <StyledInput 
               name="id" 
               value={id || ''}></StyledInput>
               {/* to do : make this field un-editable */}
         </FormElement>

         <FormElementFeedback />

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

         <div className="flex justify-end gap-1 my-1">
            <StyledButton aria-label="Apply." type="submit" >Apply</StyledButton>
            <StyledButton aria-label="Cancel." type="button" onClicked={props.close_modal} >Cancel</StyledButton>
         </div>
      </form>
   )
}

export default UpdateProjectForm