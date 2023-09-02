import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../Utility/Validation/uiValidation'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'


//
// to do : copied of sessions - adapt -> sessions are much simpler data
//


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

      // to do : 
      // validate started_at & ended_at
      // - create validate_datetime() function?
      // if(!validate_int(formJson['started_at'],{},setStartedAtFeedback)) {
      //    validated = false
      // }
      // if(!validate_int(formJson['ended_at'],{},setEndedAtFeedback)) {
      //    validated = false
      // }

      if(!validate_int(formJson['author_id'],{},setAuthorIdFeedback)) {
         validated = false
      }
      
      if(validated) props.onSubmit(formJson)
   }

   
{/* 

to do :  
- user can edit both start and end time?
- user can edit date?

author_id:1
duration:1
end_time:"12:30"
ended_at:"2023-08-28 12:30:33"
id:18
offset:169
start_time:"11:50"
started_at:"2023-08-28 11:50:33"

*/}

   return (
      <form onSubmit={handleSubmit} className="p-3 px-4">

         <h5 className="text-2xl mb-5">Edit session</h5>

         <input type="hidden" name="id" value={id || 0} />


         <FormElement>
            <label htmlFor="started_at" className="w-12/12 md:w-2/12">Started At</label>
            <StyledInput 
               name="started_at" 
               value={started_at || ''} 
               onChanged={setStartedAt}></StyledInput>
         </FormElement>
         <FormElementFeedback feedback_msg={started_at_feedback}/>


         <FormElement>
            <label htmlFor="ended_at" className="w-12/12 md:w-2/12">Ended At</label>
            <StyledInput 
               name="ended_at" 
               value={ended_at || ''} 
               onChanged={setEndedAt}></StyledInput>
         </FormElement>
         <FormElementFeedback feedback_msg={ended_at_feedback}/>


         <FormElement>
            <label htmlFor="author_id" className="w-12/12 md:w-2/12">Author Id</label>
            <StyledInput 
               name="author_id" 
               value={author_id || ''} 
               onChanged={setAuthorId}></StyledInput>
         </FormElement>
         <FormElementFeedback feedback_msg={author_id_feedback}/>


         <div className="flex justify-end gap-1">
            <StyledButton aria-label="Apply." type="submit" >Apply</StyledButton>
            <StyledButton aria-label="Delete." type="button" onClicked={props.onDelete}>Delete</StyledButton>
            <StyledButton aria-label="Cancel." type="button" onClicked={props.close_modal}>Cancel</StyledButton>
         </div>

      </form>
   )
}

export default EditSessionForm