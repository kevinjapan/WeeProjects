import React, { useState,useEffect } from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../Utility/Validation/uiValidation'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import StyledTextArea from '../../Utility/StyledTextArea/StyledTextArea'
import { generate_slug } from '../../Utility/Stringer/uiStringer'



const AddTodoForm = props => {

   const [title,setTitle] = useState('')
   const [task_id,setTaskId] = useState(props.task_id)
   const [outline,setOutline] = useState('')
   const [author_id,setAuthorId] = useState('')
   const [title_feedback,setTitleFeedback] = useState('')
   const [task_id_feedback,setTaskIdFeedback] = useState('')
   const [author_id_feedback,setAuthorIdFeedback] = useState('')
   const [outline_feedback,setOutlineFeedback] = useState('')


   // We validate Task Id up-front to avoid user entering data and then discovering issue
   useEffect(() => {
      validate_int(props.task_id,{min_value:1},setTaskIdFeedback)
   },[props.task_id])


   const handleSubmit = e => {
      
      setTitleFeedback('')
      setTaskIdFeedback('')
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

      // we include Task Id to reduce likelihood of any bug inconveniencing user.
      if(!validate_int(formJson['task_id'],{min_value:1},setTaskIdFeedback)) {
         validated = false
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

         <input type="hidden" name="task_id" value={props.task_id || 0} />
         
         <div className="flex">

            <section className="w-2/12">

               <FormElement>
                  <label htmlFor="task_id" className="italic pt-1 w-12/12 md:w-6/12">Task Id</label>
                  <StyledInput 
                     name="task_id" 
                     value={task_id || 0}
                     placeholder="the task id"
                     classes="w-6/12"
                     onChanged={setTaskId}
                     readonly></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={task_id_feedback}/>

               <FormElement>
                  <label htmlFor="author_id" className="italic pt-1 w-12/12 md:w-6/12">Author Id</label>
                  <StyledInput 
                     name="author_id" 
                     value={author_id || 1}
                     placeholder="enter the author id here"
                     classes="w-6/12"
                     onChanged={setAuthorId}></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={author_id_feedback}/>

            </section>


            <section className="w-10/12 pl-12">

               <FormElement>
                  <label htmlFor="title" className="italic pt-1 w-12/12 md:w-1/12">Title</label>
                  <StyledInput 
                     name="title" 
                     value={title}
                     placeholder="enter the title here"
                        classes="w-11/12"
                     onChanged={setTitle}></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={title_feedback}/>

               <FormElement>
                     <label htmlFor="outline" className="italic pt-1 w-12/12 md:w-1/12">Outline</label>
                     <StyledTextArea 
                        name="outline" 
                        value={outline}
                        placeholder=""
                        classes="w-11/12"
                        onChanged={setOutline}></StyledTextArea>
               </FormElement>
               <FormElementFeedback feedback_msg={outline_feedback}/>
   
            </section>

         </div>
   
         <div className="flex justify-end gap-1 my-1">
               <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
               <StyledButton aria-label="Cancel." type="button" onClicked={props.close_modal}>Cancel</StyledButton>
         </div>
   
      </form>
   )
}

export default AddTodoForm