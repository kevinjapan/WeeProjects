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
   const [author_id,setAuthorId] = useState(props.session.author_id)
   const [author_id_feedback,setAuthorIdFeedback] = useState('')

   const handleSubmit = e => {
      
      setTitleFeedback('')
      setAuthorIdFeedback('')
      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());

      let validated = true


      if(!validate_int(formJson['author_id'],{},setAuthorIdFeedback)) {
         validated = false
      }
      
      if(validated) props.onSubmit(formJson)
   }

   
{/* 

to do :  
- user can edit both start and end time?
- user can edit date?

*/}

   return (
      <form onSubmit={handleSubmit} className="p-3 px-4">

         <h5 className="text-2xl mb-5">Edit session</h5>

         <input type="hidden" name="id" value={id || 0} />

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