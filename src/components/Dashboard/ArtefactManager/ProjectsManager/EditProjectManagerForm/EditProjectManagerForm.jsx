import React, { useState } from 'react'
import StyledButton from '../../../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../../../Utility/Validation/uiValidation'
import FormElement from '../../../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../../../Utility/StyledInput/StyledInput'
import StyledTextArea from '../../../../Utility/StyledTextArea/StyledTextArea'
import FormElementFeedback from '../../../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import { generate_slug } from '../../../../Utility/Stringer/uiStringer'
import { datetimestamp } from '../../../../Utility/DateTime/DateTime'


//
// Most editing of an artefact is through the UI front-end.
// Currently, this form is essentially for deletion, inputs have been set to 'readonly'.
// 

const EditProjectManagerForm = props => {

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
      } 
      else {
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

         <div className="flex">

            <section className="w-2/12">
               <FormElement>
                  <label htmlFor="id" className="italic pt-1 w-12/12 md:w-6/12">Id</label>
                  <StyledInput 
                     id="id"
                     name="id" 
                     value={id || ''}
                     classes="w-6/12"
                     readonly></StyledInput>
               </FormElement>
               <FormElementFeedback />


               <FormElement>
                  <label htmlFor="author_id" className="italic pt-1 w-12/12 md:w-6/12">Author Id</label>
                  <StyledInput 
                     id="author_id"
                     name="author_id" 
                     value={author_id || 1}
                     classes="w-6/12" 
                     onChanged={setAuthorId}
                     readonly></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={author_id_feedback}/>
            </section>

            
            <section className="w-10/12 pl-12">

               <FormElement>
                  <label htmlFor="title" className="italic pt-1 w-12/12 md:w-1/12">Title</label>
                  <StyledInput 
                     id="title"
                     name="title" 
                     value={title || ''}
                     classes="w-11/12" 
                     onChanged={setTitle}
                     readonly></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={title_feedback}/>

            </section>


         </div>

         <div className="flex justify-end gap-1 my-1">
            <StyledButton aria-label="Apply." type="submit" >Apply</StyledButton>
            <StyledButton aria-label="Delete this project." onClicked={props.onDelete}>Delete</StyledButton>
            <StyledButton aria-label="Cancel." type="button" onClicked={props.close_modal} >Cancel</StyledButton>
         </div>
      </form>
   )
}

export default EditProjectManagerForm