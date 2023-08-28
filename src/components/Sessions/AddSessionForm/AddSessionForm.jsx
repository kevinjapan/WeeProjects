import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../Utility/Validation/uiValidation'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'


//
// to do : copied of sessions - adapt -> sessions are much simpler data
//



const AddSessionForm = props => {

   const [author_id,setAuthorId] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')

   const handleSubmit = e => {
      
      setAuthorIdFeedback('')

      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());

      let validated = true

      // to do : similar to checking 'title' is unique on titled artefacts,
      //         do we want to check the current Sessionable item doesn't already have an open Session?
      //         see also EditSessionForm

      // if(!props.is_unique(0,'title',formJson['title'])) {
      //    setTitleFeedback('This title already exists, please enter a different title.')
      //    validated = false
      // }

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


         {/* to do : started_at will be automatically generated in DB on creation.. */}


         <div className="flex justify-end gap-1 my-1">
               <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
               <StyledButton aria-label="Cancel." type="button" onClicked={props.close_modal}>Cancel</StyledButton>
         </div>
      </form>
   )
}

export default AddSessionForm