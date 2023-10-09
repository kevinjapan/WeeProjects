import React, { useState } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../Utility/Validation/uiValidation'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import StyledTextArea from '../../Utility/StyledTextArea/StyledTextArea'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import { generate_slug } from '../../Utility/Stringer/uiStringer'
import { datetimestamp } from '../../Utility/DateTime/DateTime'
import { LENGTHS as LEN } from '../../Utility/utilities/enums'



const EditTodoForm = props => {

   const [id] = useState(props.todo.id)
   const [task_id] = useState(props.todo.task_id)

   // Todo properties : validated inputs
   const [title,setTitle] = useState(props.todo.title || '')
   const [author_id,setAuthorId] = useState(props.todo.author_id || 0)
   const [outline,setOutline] = useState(props.todo.outline || '')
   const [solution,setSolution] = useState(props.todo.solution || '')

   // - validated input UI feedback
   const [title_feedback,setTitleFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')
   const [outline_feedback,setOutlineFeedback] = useState('')
   const [solution_feedback,setSolutionFeedback] = useState('')

   // Todo properties : flags
   const [done_at,setDoneAt] = useState(props.todo.done_at ? true : false)
   const [pin,setPin] = useState(props.todo.pin ? true : false)
   const [is_on_going,setIsOnGoing] = useState(props.todo.on_going ? true : false)
   const [has_checklist,setHasCheckList] = useState(props.todo.has_checklist ? true : false)


   const handleSubmit = e => {
      
      setTitleFeedback('')
      setAuthorIdFeedback('')
      setOutlineFeedback('')
      setSolutionFeedback('')
      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());
      formJson.pin = pin
      formJson.on_going = is_on_going
      formJson.has_checklist = has_checklist

      // done_at - can be either : null/existing/datetimestamp
      formJson.done_at = null
      if(done_at) {
         formJson.done_at = props.todo.done_at ? props.todo.done_at : datetimestamp()
      } 

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
      if(!validate_string(formJson['solution'],{'min_length':0,'max_length':LEN.TEXT_MAX},setSolutionFeedback,false)) {
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
   const toggle_has_checklist = () => {
      setHasCheckList(!has_checklist)
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

               <input type="hidden" name="task_id" value={task_id || 0} />
               <input type="hidden" name="done_at" value={props.todo.done_at ? props.todo.done_at : ''} />

               <FormElement>
                  <label htmlFor="id" className="italic pt-1 w-12/12 md:w-6/12">ID</label>  
                  <StyledInput 
                     name="id" 
                     value={id || ''}
                     classes="w-6/12"
                     readonly></StyledInput>
               </FormElement>
               <FormElementFeedback /> 

               <FormElement>
                  <label htmlFor="author_id" className="italic pt-1 w-12/12 md:w-6/12">Author Id</label>
                  <StyledInput 
                     name="author_id" 
                     value={author_id || 1} 
                     onChanged={setAuthorId}
                     classes="w-6/12"
                     ></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={author_id_feedback}/>
            </section>

            <section className="w-10/12 pl-12">
               <FormElement>
                     <label htmlFor="outline" className="italic pt-1 w-12/12 md:w-1/12">Pitch, Outline</label>
                     <StyledTextArea 
                        name="outline" 
                        value={outline || ''}
                        placeholder=""
                        onChanged={setOutline}
                        classes="w-11/12"></StyledTextArea>
               </FormElement>
               <FormElementFeedback feedback_msg={outline_feedback}/>
          
               <FormElement>
                     <label htmlFor="solution" className="italic pt-1 w-12/12 md:w-1/12">Solution</label>
                     <StyledTextArea 
                        name="solution" 
                        value={solution || ''}
                        placeholder=""
                        onChanged={setSolution}
                        classes="w-11/12"></StyledTextArea>
               </FormElement>
               <FormElementFeedback feedback_msg={solution_feedback}/>
            </section>

         </div>

         <div className="flex justify-end gap-1">

            <div className="flex gap-2 items-center mr-7">
               <input 
                  name="has_checklist"
                  type="checkbox" 
                  checked={has_checklist || false}
                  value=''
                  onChange={e => {toggle_has_checklist(e.target.checked)}} 
               />CheckList
            </div>

            <div className="flex gap-2 items-center mr-7">
               <input 
                  name="done_at"
                  type="checkbox" 
                  checked={done_at || false}
                  value=''
                  onChange={e => {toggle_done_at(e.target.checked)}} 
               />Done
            </div>

            <div className="flex gap-2 items-center mr-7">
               <input 
                  name="on_going"
                  type="checkbox" 
                  checked={is_on_going || false}
                  value=''
                  onChange={e => {toggle_ongoing(e.target.checked)}} 
               />Mark as on-going
            </div>
            
            <div className="flex gap-2 items-center mr-7">
               <input 
                  name="pin"
                  type="checkbox" 
                  checked={pin || false}
                  value=''
                  onChange={e => {toggle_pin(e.target.checked)}} 
               />Pin to start of list
            </div>

            <StyledButton aria-label="Apply" type="submit">Apply</StyledButton>
            <StyledButton aria-label="Delete" onClicked={props.onDelete}>Delete</StyledButton>
            <StyledButton aria-label="Cancel" onClicked={props.close_modal}>Cancel</StyledButton>
         </div>
      </form>
   )
}

export default EditTodoForm