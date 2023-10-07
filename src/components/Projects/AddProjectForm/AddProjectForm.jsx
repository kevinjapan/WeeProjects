import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_string,validate_int } from '../../Utility/Validation/uiValidation'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import { generate_slug } from '../../Utility/Stringer/uiStringer'



const AddProjectForm = props => {

   const [title,setTitle] = useState('')
   const [author_id,setAuthorId] = useState('')
   const [title_feedback,setTitleFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')

   const handleSubmit = e => {
      
      setTitleFeedback('')
      setAuthorIdFeedback('')

      e.preventDefault()
      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries())

      let validated = true

      formJson['title'] = formJson['title'].trim()

      if(!props.is_unique(0,'title',formJson['title'])) {
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

         <h5 className="text-2xl mb-5">Add Project</h5>


         <div className="flex">
   
            <section className="w-2/12">

               <FormElement>
                  <label htmlFor="author_id" className="w-12/12 md:w-6/12">Author Id</label>
                  <StyledInput 
                     name="author_id" 
                     // future - currently all author_id's default to 1 for convenience (ok with 1 user!)
                     value={author_id || 1}
                     placeholder="enter the author id here"
                     classes="w-6/12"
                     onChanged={setAuthorId}></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={author_id_feedback}/>
            </section>

            
            <section className="w-10/12 pl-12">
               <FormElement>
                  <label htmlFor="title" className="w-12/12 md:w-1/12">Title</label>
                  <StyledInput 
                     name="title" 
                     value={title}
                     placeholder="enter the title here"
                     classes="w-11/12" 
                     onChanged={setTitle}></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={title_feedback}/>
            </section>

         </div>


         <div className="flex justify-end gap-1 my-1">
               <StyledButton aria-label="Apply." type="submit" >Apply</StyledButton>
               <StyledButton aria-label="Cancel." onClicked={props.close_modal}>Cancel</StyledButton>
         </div>
      </form>
   )
}

export default AddProjectForm