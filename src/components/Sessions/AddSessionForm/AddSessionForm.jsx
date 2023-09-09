import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_datetime_string } from '../../Utility/Validation/uiValidation'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import {get_db_ready_datetime} from '../../Utility/DateTime/DateTime'




const AddSessionForm = props => {

   let date = new Date()

   const [started_at,setStartedAt] = useState(get_db_ready_datetime(date))
   const [author_id,setAuthorId] = useState('')
   const [started_at_feedback,setStartedAtFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')


   const handleSubmit = e => {

      setStartedAtFeedback('')
      setAuthorIdFeedback('')

      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());

      let validated = true

      // future : do we want to check current Sessionable item doesn't already have an open Session? does it matter?

      if(!validate_datetime_string(formJson['started_at'],{},setStartedAtFeedback)) {
         validated = false
      }

      if(!validate_int(formJson['author_id'],{},setAuthorIdFeedback)) {
         validated = false
      }

      if(validated) props.onSubmit(formJson)
   }


   return (
      <form onSubmit={handleSubmit}>

         <h5 className="text-2xl mb-5">Add session</h5>
         
         <input type="hidden" name="sessionable_type" value={props.sessionable_type} />
         <input type="hidden" name="sessionable_id" value={props.sessionable_id} />

         <div className="flex">

            <section className="w-4/12">
               <FormElement>
                  <label htmlFor="author_id" className="italic pt-1 w-12/12 md:w-4/12">Started At</label>
                  <StyledInput 
                     name="started_at" 
                     value={started_at}
                     placeholder="enter the started_at datetime here"
                     classes="w-8/12"
                     onChanged={setStartedAt}></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={started_at_feedback}/>


               <FormElement>
                  <label htmlFor="author_id" className="italic pt-1 w-12/12 md:w-4/12">Author Id</label>
                  <StyledInput 
                     name="author_id" 
                     value={author_id || 1}
                     placeholder="enter the author id here"
                     classes="w-8/12"
                     onChanged={setAuthorId}></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={author_id_feedback}/>

            </section>

            <section className="w-8/12 pl-12"></section>

         </div>

         <div className="flex justify-end gap-1 my-1">
               <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
               <StyledButton aria-label="Cancel." type="button" onClicked={props.close_modal}>Cancel</StyledButton>
         </div>

      </form>
   )
}

export default AddSessionForm