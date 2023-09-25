import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../Utility/Validation/uiValidation'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import StyledTextArea from '../../Utility/StyledTextArea/StyledTextArea'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import { generate_slug } from '../../Utility/Stringer/uiStringer'
import { datetimestamp } from '../../Utility/DateTime/DateTime'



const EditMessageForm = props => {

   const [id] = useState(props.todo.id)
   const [task_id] = useState(props.todo.task_id)

   // Todo properties : validated inputs
   const [title,setTitle] = useState(props.todo.title || '')
   const [author_id,setAuthorId] = useState(props.todo.author_id || 0)
   const [body,setBody] = useState(props.todo.body || '')
   const [solution,setSolution] = useState(props.todo.solution || '')

   // - validated input UI feedback
   const [title_feedback,setTitleFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')
   const [body_feedback,setBodyFeedback] = useState('')


   const handleSubmit = e => {
      
      setTitleFeedback('')
      setAuthorIdFeedback('')
      setOutlineFeedback('')
      setSolutionFeedback('')
      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries())

      let validated = true
      
      formJson['title'] = formJson['title'].trim()

      if(!props.is_unique(formJson['id'],'title',formJson['title'])) {
         setTitleFeedback('This title already exists, please enter a different title.')
         validated = false
      }

      if(!validate_string(formJson['title'],{'min_length':10,'max_length':120},setTitleFeedback)) {
         validated = false
      } else {
         formJson['slug'] = generate_slug(formJson['title'])
      }

      if(!validate_int(formJson['author_id'],{},setAuthorIdFeedback)) {
         validated = false
      }
      if(!validate_string(formJson['body'],{'min_length':10,'max_length':2000},setBodyFeedback)) {
         validated = false
      }
      
      if(validated) props.onSubmit(formJson)
   }

   return (
      <form onSubmit={handleSubmit} className="p-3 px-4">

         <div className="flex justify-center w-full">
            <section className="w-full mt-1">

               <FormElement className="w-full">
                  <StyledInput 
                     name="title" 
                     value={title || ''} 
                     classes="text-2xl w-full font-light border-none pl-0 ml-0"
                     onChanged={setTitle}></StyledInput>
               </FormElement>
               
               <FormElementFeedback feedback_msg={title_feedback}/>
            </section>
         </div>

         <div className="flex">

            <section className="w-2/12">

               <input type="hidden" name="project_id" value={project_id || 0} />

               <FormElement>
                  <label htmlFor="id" className="italic pt-1 w-12/12 md:w-6/12">ID</label>  
                  <StyledInput 
                     name="id" 
                     value={id || ''}
                     classes="w-6/12"
                     readonly></StyledInput>
               </FormElement>
               <FormElementFeedback /> 

               <FormElement>
                  <label htmlFor="author_id" className="italic pt-1 w-12/12 md:w-6/12">Author Id</label>
                  <StyledInput 
                     name="author_id" 
                     value={author_id || 1} 
                     onChanged={setAuthorId}
                     classes="w-6/12"
                     ></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={author_id_feedback}/>
            </section>

            <section className="w-10/12 pl-12">
               <FormElement>
                     <label htmlFor="body" className="italic pt-1 w-12/12 md:w-1/12">Body</label>
                     <StyledTextArea 
                        name="body" 
                        value={body || ''}
                        placeholder=""
                        onChanged={setBody}
                        classes="w-11/12"></StyledTextArea>
               </FormElement>
               <FormElementFeedback feedback_msg={body_feedback}/>
          
            </section>

         </div>

         <div className="flex justify-end gap-1">
            <StyledButton aria-label="Apply" type="submit">Apply</StyledButton>
            <StyledButton aria-label="Delete" onClicked={props.onDelete}>Delete</StyledButton>
            <StyledButton aria-label="Cancel" onClicked={props.close_modal}>Cancel</StyledButton>
         </div>
      </form>
   )
}

export default EditMessageForm