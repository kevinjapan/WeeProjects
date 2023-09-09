import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_datetime_string } from '../../Utility/Validation/uiValidation'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'



const EditSessionForm = props => {

   const [id] = useState(props.session.id)
   const [started_at,setStartedAt] = useState(props.session.started_at)
   const [ended_at,setEndedAt] = useState(props.session.ended_at)
   const [author_id,setAuthorId] = useState(props.session.author_id)
   const [started_at_feedback,setStartedAtFeedback] = useState('')
   const [ended_at_feedback,setEndedAtFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')

   const handleSubmit = e => {
      
      setStartedAtFeedback('')
      setEndedAtFeedback('')
      setAuthorIdFeedback('')
      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());

      let validated = true

      if(!validate_datetime_string(formJson['started_at'],{},setStartedAtFeedback)) {
         validated = false
      }
      if(formJson['ended_at'] !== "") {
         if(!validate_datetime_string(formJson['ended_at'],{},setEndedAtFeedback)) {
            validated = false
         }
      } else {
         formJson['ended_at'] = null
      }

      if(!validate_int(formJson['author_id'],{},setAuthorIdFeedback)) {
         validated = false
      }
      
      if(validated) props.onSubmit(formJson)
   }

   return (
      <form onSubmit={handleSubmit} className="p-3 px-4">

         <h5 className="text-2xl mb-5">Edit session</h5>

         <input type="hidden" name="id" value={id || 0} />


         <div className="flex">
         
            <section className="w-4/12">
               <FormElement>
                  <label htmlFor="started_at" className="italic pt-1 w-12/12 md:w-4/12">Started At</label>
                  <StyledInput 
                     name="started_at" 
                     value={started_at || ''} 
                     onChanged={setStartedAt}
                     classes="w-8/12"></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={started_at_feedback}/>


               <FormElement>
                  <label htmlFor="ended_at" className="italic pt-1 w-12/12 md:w-4/12">Ended At</label>
                  <StyledInput 
                     name="ended_at" 
                     value={ended_at || ''} 
                     onChanged={setEndedAt}
                     classes="w-8/12"></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={ended_at_feedback}/>


               <FormElement>
                  <label htmlFor="author_id" className="italic pt-1 w-12/12 md:w-4/12">Author Id</label>
                  <StyledInput 
                     name="author_id" 
                     value={author_id || ''} 
                     onChanged={setAuthorId}
                     classes="w-8/12"></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={author_id_feedback}/>

               </section>

               <section className="w-8/12 pl-12"></section>

         </div>

         <div className="flex justify-end gap-1">
            <StyledButton aria-label="Apply." type="submit" >Apply</StyledButton>
            <StyledButton aria-label="Delete." type="button" onClicked={props.onDelete}>Delete</StyledButton>
            <StyledButton aria-label="Cancel." type="button" onClicked={props.close_modal}>Cancel</StyledButton>
         </div>

      </form>
   )
}

export default EditSessionForm