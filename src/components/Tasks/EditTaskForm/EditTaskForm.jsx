import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_string,validate_int } from '../../Utility/Validation/uiValidation'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import StyledTextArea from '../../Utility/StyledTextArea/StyledTextArea'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import { generate_slug } from '../../Utility/Stringer/uiStringer'
import { LENGTHS as LEN } from '../../Utility/utilities/enums'



const UpdateTaskForm = props => {

   const [id] = useState(props.task.id)
   const [title,setTitle] = useState(props.task.title)
   const [author_id,setAuthorId] = useState(props.task.author_id)
   const [outline,setOutline] = useState(props.task.outline)
   const [title_feedback,setTitleFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')
   const [outline_feedback,setOutlineFeedback] = useState('')
   const [pin,setPin] = useState(props.task.pin > 0 ? true : false)

   const handleSubmit = e => {
      
      setTitleFeedback('')
      setAuthorIdFeedback('')
      setOutlineFeedback('')
      e.preventDefault()
      
      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());
      formJson.pin = pin

      let validated = true

      formJson['title'] = formJson['title'].trim()

      if(!props.is_unique(formJson['id'],'title',formJson['title'])) {
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
      if(!validate_string(formJson['outline'],{'min_length':LEN.TEXT_MIN,'max_length':LEN.TEXT_MAX},setOutlineFeedback)) {
         validated = false
      }
      
      if(validated) props.onSubmit(formJson)
   }

   const toggle_pin = () => {
      setPin(!pin)
   }

   return (
      <form onSubmit={handleSubmit}>

         <h5 className="text-2xl mb-5">Edit Task</h5>


         <div className="flex">

         
            <section className="w-2/12">

               <FormElement>
                  <label htmlFor="id" className="italic pt-1 w-12/12 md:w-6/12">Id</label>  
                  <StyledInput 
                     name="id" 
                     value={id || ''}
                     readonly
                        classes="w-6/12"></StyledInput>
               </FormElement>
               <FormElementFeedback />

               <FormElement>
                  <label htmlFor="author_id" className="italic pt-1 w-12/12 md:w-6/12">Author Id</label>
                  <StyledInput 
                     name="author_id" 
                     value={author_id || 1}
                     onChanged={setAuthorId}
                        classes="w-6/12"></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={author_id_feedback}/>

            </section>

            
            <section className="w-10/12 pl-12">


               <FormElement>
                  <label htmlFor="title" className="italic pt-1 w-12/12 md:w-1/12">Title</label>  
                  <StyledInput 
                     name="title" 
                     value={title || ''}
                     onChanged={setTitle}
                        classes="w-11/12"></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={title_feedback}/>

               <FormElement>
                  <label htmlFor="outline" className="italic pt-1 w-12/12 md:w-1/12">Outline</label>
                  <StyledTextArea 
                     name="outline" 
                     value={outline || ''}
                     onChanged={setOutline}
                     classes="w-11/12"></StyledTextArea>
               </FormElement>
               <FormElementFeedback feedback_msg={outline_feedback}/>

            </section>

         </div>

         <div className="flex gap-2 items-center text-slate-400 text-sm mr-7">
            <input 
               name="pin"
               type="checkbox" 
               checked={pin || false}
               onChange={e => {toggle_pin(e.target.checked)}} 
            />pin to start of task list
         </div>

         <div className="flex justify-end gap-1 my-1">
            <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
            <StyledButton aria-label="Delete" onClicked={props.onDelete}>Delete</StyledButton>
            <StyledButton aria-label="Cancel." onClicked={props.close_modal} >Cancel</StyledButton>
         </div>
      </form>
   )
}

export default UpdateTaskForm