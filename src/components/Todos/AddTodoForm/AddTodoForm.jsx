import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../Utility/Validation/uiValidation'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import StyledTextArea from '../../Utility/StyledTextArea/StyledTextArea'
import { generate_slug } from '../../Utility/Stringer/uiStringer'



const AddTodoForm = props => {

   const [title,setTitle] = useState('')
   const [outline,setOutline] = useState('')
   const [author_id,setAuthorId] = useState('')
   const [title_feedback,setTitleFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')
   const [outline_feedback,setOutlineFeedback] = useState('')

   const handleSubmit = e => {
      
      setTitleFeedback('')
      setAuthorIdFeedback('')
      setOutlineFeedback('')

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

      if(!validate_string(formJson['title'],{'min_length':10,'max_length':80},setTitleFeedback)) {
         validated = false
      } else {
         formJson['slug'] = generate_slug(formJson['title'])
      }

      if(!validate_int(formJson['author_id'],{},setAuthorIdFeedback)) {
         validated = false
      }

      if(!validate_string(formJson['outline'],{'min_length':10,'max_length':500},setOutlineFeedback)) {
         validated = false
      }
      
      if(validated) props.onSubmit(formJson)
   }

   return (
      <form onSubmit={handleSubmit}>

         <h5 className="text-2xl mb-5">Add Todo</h5>
         
         <FormElement>
            <label htmlFor="title" className="w-12/12 md:w-2/12">Title</label>
            <StyledInput 
               name="title" 
               value={title}
               placeholder="enter the title here"
               classes="grow" 
               onChanged={setTitle}></StyledInput>
         </FormElement>
         <FormElementFeedback feedback_msg={title_feedback}/>


         <FormElement>
            <label htmlFor="author_id" className="w-12/12 md:w-2/12">Author Id</label>
            <StyledInput 
               name="author_id" 
               value={author_id}
               placeholder="enter the author id here"
               classes="grow"
               onChanged={setAuthorId}></StyledInput>
         </FormElement>
         <FormElementFeedback feedback_msg={author_id_feedback}/>


         <FormElement>
               <label htmlFor="outline" className="w-12/12 md:w-2/12">Outline</label>
               <StyledTextArea 
                  name="outline" 
                  value={outline}
                  placeholder=""
                  onChanged={setOutline}></StyledTextArea>
         </FormElement>
         <FormElementFeedback feedback_msg={outline_feedback}/>
   
   
         <div className="flex justify-end gap-1 my-1">
               <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
               <StyledButton aria-label="Cancel." type="button" onClicked={props.close_modal}>Cancel</StyledButton>
         </div>
   
      </form>
   )
}

export default AddTodoForm