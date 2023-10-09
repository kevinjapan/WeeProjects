import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../Utility/Validation/uiValidation'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import { generate_slug } from '../../Utility/Stringer/uiStringer'
import { datetimestamp } from '../../Utility/DateTime/DateTime'
import { LENGTHS as LEN } from '../../Utility/utilities/enums'



const EditCheckListItemForm = props => {

   const [id] = useState(props.checklistitem.id)
   const [todo_id] = useState(props.checklistitem.todo_id)
   const [title,setTitle] = useState(props.checklistitem.title || '')
   const [author_id,setAuthorId] = useState(props.checklistitem.author_id || 0)
   const [title_feedback,setTitleFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')
   const [done_at,setDoneAt] = useState(props.checklistitem.done_at ? true : false)


   const handleSubmit = e => {
      
      setTitleFeedback('')
      setAuthorIdFeedback('')
      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());

      // done_at - null / existing / new datetimestamp
      formJson.done_at = null
      if(done_at) {
         formJson.done_at = props.checklistitem.done_at ? props.checklistitem.done_at : datetimestamp()
      } 

      let validated = true
      
      formJson['title'] = formJson['title'].trim()

      // if(!props.is_unique(formJson['id'],'title',formJson['title'])) {
      //    setTitleFeedback('This title already exists, please enter a different title.')
      //    validated = false
      // }

      if(!validate_string(formJson['title'],{'min_length':LEN.TITLE_MIN,'max_length':LEN.TITLE_MAX},setTitleFeedback)) {
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

   const toggle_done_at = () => {
      setDoneAt(!done_at)
   }
   const toggle_pin = () => {
      setPin(!pin)
   } 
   const toggle_ongoing = () => {
      setIsOnGoing(!is_on_going)
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

               <input type="hidden" name="todo_id" value={todo_id || 0} />
               <input type="hidden" name="done_at" value={props.checklistitem.done_at ? props.checklistitem.done_at : ''} />

               <FormElement>
                  <label htmlFor="id" className="italic pt-1 w-12/12 md:w-6/12">ID</label>  
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
                     onChanged={setAuthorId}
                     classes="w-6/12"
                     ></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={author_id_feedback}/>

            </section>

            <section className="w-10/12 pl-12"></section>

         </div>

         <div className="flex justify-end gap-1">

            <div className="flex gap-2 items-center text-slate-400 text-sm mr-7">
               <input 
                  id="done_at"
                  name="done_at"
                  type="checkbox" 
                  checked={done_at || false}
                  value=''
                  onChange={e => {toggle_done_at(e.target.checked)}} 
               />done
            </div>

            <StyledButton aria-label="Apply" type="submit">Apply</StyledButton>
            <StyledButton aria-label="Delete" onClicked={props.onDelete}>Delete</StyledButton>
            <StyledButton aria-label="Cancel" onClicked={props.close_modal}>Cancel</StyledButton>
         
         </div>
      
      </form>
   )
}

export default EditCheckListItemForm